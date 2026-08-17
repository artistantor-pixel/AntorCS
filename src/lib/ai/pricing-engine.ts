import { AGENCY_KNOWLEDGE, ServicePackage } from './knowledge';

export interface QuoteRequestInput {
  serviceId?: string;
  category?: string;
  pageCount?: number;
  hasPaymentGateway?: boolean;
  hasAdminPanel?: boolean;
  hasAiIntegration?: boolean;
  isUrgent?: boolean; // Urgency adds 25% surcharge
  currency?: 'BDT' | 'USD';
}

export interface QuoteResult {
  serviceName: string;
  currency: 'BDT' | 'USD';
  estimatedPrice: number;
  formattedPrice: string;
  estimatedDays: string;
  breakdown: string[];
}

export function calculatePriceQuote(input: QuoteRequestInput): QuoteResult {
  const currency = input.currency || 'BDT';
  let matchedService: ServicePackage | undefined;

  if (input.serviceId) {
    matchedService = AGENCY_KNOWLEDGE.services.find((s) => s.id === input.serviceId);
  }

  if (!matchedService && input.category) {
    matchedService = AGENCY_KNOWLEDGE.services.find((s) => s.category === input.category);
  }

  if (!matchedService) {
    matchedService = AGENCY_KNOWLEDGE.services[0]; // Fallback to landing page
  }

  let basePrice = currency === 'USD' ? matchedService.basePriceUSD : matchedService.basePriceBDT;
  const breakdown: string[] = [];

  breakdown.push(`Base package (${matchedService.name}): ${currency === 'USD' ? '$' : '৳'}${basePrice.toLocaleString()}`);

  // Page count logic
  if (input.pageCount && input.pageCount > 1) {
    const extraPages = input.pageCount - 1;
    const pageCost = currency === 'USD' ? extraPages * 25 : extraPages * 2500;
    basePrice += pageCost;
    breakdown.push(`Extra ${extraPages} page(s): +${currency === 'USD' ? '$' : '৳'}${pageCost.toLocaleString()}`);
  }

  // Payment gateway add-on
  if (input.hasPaymentGateway && matchedService.id !== 'web_ecommerce') {
    const gatewayCost = currency === 'USD' ? 60 : 6000;
    basePrice += gatewayCost;
    breakdown.push(`Payment Gateway integration (bKash/Nagad/Cards): +${currency === 'USD' ? '$' : '৳'}${gatewayCost.toLocaleString()}`);
  }

  // Admin panel add-on
  if (input.hasAdminPanel && matchedService.id !== 'web_custom_app' && matchedService.id !== 'web_ecommerce') {
    const adminCost = currency === 'USD' ? 100 : 10000;
    basePrice += adminCost;
    breakdown.push(`Custom Admin Panel: +${currency === 'USD' ? '$' : '৳'}${adminCost.toLocaleString()}`);
  }

  // AI Agent add-on
  if (input.hasAiIntegration && matchedService.id !== 'ai_agent_custom') {
    const aiCost = currency === 'USD' ? 150 : 15000;
    basePrice += aiCost;
    breakdown.push(`AI Chatbot / Agent Integration: +${currency === 'USD' ? '$' : '৳'}${aiCost.toLocaleString()}`);
  }

  // Urgency logic
  if (input.isUrgent) {
    const urgentFee = Math.round(basePrice * 0.25);
    basePrice += urgentFee;
    breakdown.push(`Urgent Delivery (25% rush charge): +${currency === 'USD' ? '$' : '৳'}${urgentFee.toLocaleString()}`);
  }

  const symbol = currency === 'USD' ? '$' : '৳';
  const formattedPrice = `${symbol}${basePrice.toLocaleString()} ${currency}`;

  return {
    serviceName: matchedService.name,
    currency,
    estimatedPrice: basePrice,
    formattedPrice,
    estimatedDays: input.isUrgent ? "Fast-tracked (2-4 days)" : matchedService.estimatedDays,
    breakdown,
  };
}
