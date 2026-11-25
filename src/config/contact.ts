export const CONTACT_INFO = {
  name: "Antor Kumar Biswas",
  role: "Creative Designer",
  email: "artistantor@gmail.com",
  phoneDisplay: "+880 1872-185776",
  phoneRaw: "+8801872185776",
  whatsappNumber: "8801872185776",
  localNumber: "01872-185776",
  address: "Jagannath Hall, University of Dhaka",
  city: "Dhaka, Bangladesh",
  cityShort: "Dhaka, BD",
  cvPath: "/ANTOR_KUMAR_BISWAS.pdf",
  cvFileName: "ANTOR_KUMAR_BISWAS.pdf",
} as const;

export function getWhatsAppUrl(message?: string): string {
  const base = `https://wa.me/${CONTACT_INFO.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
