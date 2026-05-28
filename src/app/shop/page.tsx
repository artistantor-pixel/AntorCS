"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Download, CreditCard, X, ShieldCheck, RefreshCw, FileText, BookOpen, Lock, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  pdfUrl: string;
  image: string;
  isActive: boolean;
}

// Seed mock products in case database is empty
const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    title: "The Ultimate Guide to Motion & Storyboarding",
    description: "Learn the secrets behind crafting engaging educational animation series, national storyboards, and e-learning visual narratives. Includes 50+ downloadable layout vectors.",
    price: 350,
    pdfUrl: "/public/downloads/motion_storyboard_guide.pdf",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964",
    isActive: true
  },
  {
    id: 2,
    title: "High-Impact Visual Identity Blueprint",
    description: "A comprehensive PDF framework detailing creative branding strategies, design systems, and color typography selection optimized for Dhaka and South Asian markets.",
    price: 290,
    pdfUrl: "/public/downloads/branding_blueprint.pdf",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=2071",
    isActive: true
  }
];

export default function ShopPage() {
  const { lang, t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Preview Reader Modal State
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [previewPage, setPreviewPage] = useState(1);

  // Checkout Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<"method" | "details" | "verifying" | "success" | "rejected">("method");
  const [paymentMethod, setPaymentMethod] = useState<"bkash" | "nagad" | null>(null);
  const [clientName, setClientName] = useState("");
  const [senderNumber, setSenderNumber] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [trxId, setTrxId] = useState("");
  const [paymentError, setPaymentError] = useState("");

  useEffect(() => {
    fetch("/api/products", { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data.filter(p => p.isActive));
        } else {
          setProducts(MOCK_PRODUCTS); // Fallback to premium seeds
        }
      })
      .catch(() => setProducts(MOCK_PRODUCTS))
      .finally(() => setIsLoading(false));
  }, []);

  // Polling logic when order is in verifying state
  useEffect(() => {
    if (checkoutStep !== "verifying" || !trxId) return;

    let pollInterval: NodeJS.Timeout;
    let limitCounter = 0;

    const checkOrderStatus = async () => {
      try {
        limitCounter++;
        // Stop checking after 60 attempts (150 seconds)
        if (limitCounter > 60) {
          setPaymentError("Verification timed out. Order is still pending. Admin will approve it shortly.");
          setCheckoutStep("details");
          clearInterval(pollInterval);
          return;
        }

        const res = await fetch(`/api/orders?trxId=${trxId.toUpperCase().trim()}`);
        if (res.ok) {
          const order = await res.json();
          if (order.status === "APPROVED") {
            setCheckoutStep("success");
            clearInterval(pollInterval);
          } else if (order.status === "REJECTED") {
            setCheckoutStep("rejected");
            clearInterval(pollInterval);
          }
        }
      } catch (e) {
        console.error("Polling error:", e);
      }
    };

    // Run first check immediately
    checkOrderStatus();

    // Poll every 2.5 seconds
    pollInterval = setInterval(checkOrderStatus, 2500);

    return () => clearInterval(pollInterval);
  }, [checkoutStep, trxId]);

  const handleCheckoutSubmit = async () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!clientName.trim()) {
      setPaymentError("Please enter your name.");
      return;
    }
    if (!clientEmail.trim() || !emailPattern.test(clientEmail.trim())) {
      setPaymentError("Please enter a valid email address.");
      return;
    }
    if (!whatsappNumber.trim() || whatsappNumber.trim().length < 11) {
      setPaymentError("Please enter a valid 11+ digit WhatsApp number.");
      return;
    }
    if (!senderNumber.trim() || senderNumber.length < 11) {
      setPaymentError("Please enter a valid 11-digit sender mobile number.");
      return;
    }
    if (!trxId.trim() || trxId.length < 8) {
      setPaymentError("Please enter a valid 8+ character Transaction ID (TrxID).");
      return;
    }

    setPaymentError("");
    
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: clientName.trim(),
          clientPhone: senderNumber.trim(),
          clientEmail: clientEmail.trim(),
          whatsappNumber: whatsappNumber.trim(),
          productTitle: selectedProduct!.title,
          price: selectedProduct!.price,
          paymentMethod: paymentMethod!,
          trxId: trxId.toUpperCase().trim()
        })
      });

      if (res.ok) {
        setCheckoutStep("verifying");
      } else {
        const err = await res.json();
        setPaymentError(err.error || "Failed to submit transaction.");
      }
    } catch (e) {
      setPaymentError("Connection error. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setCheckoutStep("method");
    setPaymentMethod(null);
    setClientName("");
    setSenderNumber("");
    setClientEmail("");
    setWhatsappNumber("");
    setTrxId("");
    setPaymentError("");
  };

  return (
    <main className="min-h-screen pt-32 pb-24 bg-background text-foreground flex flex-col items-center selection:bg-brand-red selection:text-white relative overflow-hidden">
      
      {/* Background soft blur glowing decorators */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-red/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-brand-tan/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-6xl px-6 relative z-10 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 bg-brand-red/10 text-brand-red px-4 py-2 rounded-full font-bold text-xs"
          >
            <Sparkles size={14} /> Creative Shop
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tight text-foreground">
            {lang === "bn" ? "ডিজিটাল রিসোর্স স্টোর 📚" : "Digital Resources Store 📚"}
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed">
            {lang === "bn" 
              ? "আপনার ক্রিয়েটিভ ভিজ্যুয়াল প্রোডাকশনকে আরও দ্রুত করতে ডিজাইন গাইড, স্টোরিটেলিং ব্লুপ্রিন্ট এবং রেডি-মেড টেমপ্লেট সংগ্রহ।"
              : "Premium PDF guides, storytelling blueprints, and layout templates designed to accelerate your visual productions."
            }
          </p>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
            {Array.from({ length: 2 }).map((_, idx) => (
              <div key={idx} className="bg-surface border border-border rounded-[2.5rem] p-8 h-[28rem] animate-pulse space-y-6 shadow-sm">
                <div className="w-full h-48 bg-background rounded-2xl" />
                <div className="h-6 bg-background rounded w-2/3" />
                <div className="h-4 bg-background rounded w-full" />
                <div className="h-12 bg-background rounded w-1/3 mt-6" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
            {products.map(product => (
              <motion.div
                key={product.id}
                whileHover={{ y: -6 }}
                className="bg-surface border border-border rounded-[2.5rem] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.02)] relative flex flex-col justify-between group hover:border-brand-red/30 transition-all duration-500 hover:shadow-[0_15px_40px_rgba(0,0,0,0.05)]"
              >
                <div>
                  {/* Cover Image */}
                  <div className="h-60 relative overflow-hidden">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-brand-red/10 to-brand-tan/20 flex flex-col items-center justify-center text-brand-red/40 select-none">
                        <BookOpen size={48} className="animate-pulse mb-2" />
                        <span className="text-[10px] uppercase font-bold tracking-widest font-mono text-muted/65">No Cover Available</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-95 pointer-events-none" />
                    <div className="absolute top-4 right-4 bg-brand-red text-white text-xs font-mono font-bold px-4 py-2 rounded-xl shadow-lg">
                      ৳ {product.price.toLocaleString()}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-8 space-y-4">
                    <h3 className="text-2xl font-bold font-serif text-foreground group-hover:text-brand-red transition-colors duration-300">
                      {product.title}
                    </h3>
                    <p className="text-muted text-sm leading-relaxed">{product.description}</p>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-8 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setPreviewProduct(product);
                      setPreviewPage(1);
                    }}
                    className="w-full bg-background hover:bg-surface-heavy text-muted hover:text-foreground py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all border border-border text-xs"
                  >
                    <BookOpen size={14} /> {lang === "bn" ? "স্যাম্পল পড়ুন" : "Preview Sample"}
                  </button>
                  
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setCheckoutStep("method");
                    }}
                    className="w-full bg-brand-red hover:bg-blood-red text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all border border-brand-red hover:shadow-[0_4px_25px_rgba(234,63,64,0.2)] text-xs shadow-md"
                  >
                    <CreditCard size={14} /> {lang === "bn" ? "পিডিএফটি কিনুন" : "Buy PDF Now"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>

      {/* MODAL 1: PREMIUM VIRTUAL PDF PREVIEW READER */}
      <AnimatePresence>
        {previewProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-surface border border-border rounded-[2.5rem] w-full max-w-2xl flex flex-col h-[75vh] shadow-2xl overflow-hidden relative"
            >
              {/* Header */}
              <div className="p-6 border-b border-border flex justify-between items-center bg-background shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center shrink-0">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground line-clamp-1">{previewProduct.title}</h3>
                    <p className="text-[9px] text-muted font-bold tracking-widest uppercase mt-0.5">Page Preview Console</p>
                  </div>
                </div>
                <button 
                  onClick={() => setPreviewProduct(null)} 
                  className="p-2 text-muted hover:text-foreground bg-surface border border-border rounded-xl hover:border-brand-red transition-all"
                >
                  <X size={15} />
                </button>
              </div>

              {/* PDF Sample Content Pages */}
              {previewProduct.pdfUrl.startsWith("/uploads/") ? (
                <div className="flex-1 flex flex-col p-6 bg-white overflow-hidden relative">
                  <div className="flex-1 w-full rounded-2xl border border-border bg-slate-50 relative overflow-hidden select-none">
                    <iframe 
                      src={`${previewProduct.pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`} 
                      className="w-full h-full border-0 pointer-events-none select-none" 
                    />
                    
                    {/* Glassmorphism Lock screen overlay at bottom half */}
                    <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-white via-white/95 to-transparent flex flex-col items-center justify-end pb-6 z-20 pointer-events-auto">
                      <div className="flex flex-col items-center gap-2.5 bg-white/70 backdrop-blur-md p-5 rounded-2xl border border-border/80 shadow-xl max-w-xs text-center">
                        <div className="w-9 h-9 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center border border-brand-red/15">
                          <Lock size={15} className="animate-pulse" />
                        </div>
                        <h4 className="text-xs font-serif font-black text-foreground">Sample Page Preview Locked</h4>
                        <p className="text-[9px] text-muted -mt-1 leading-relaxed">
                          This is a premium resource. Please buy the PDF guide to unlock full readable pages and dynamic files.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Outbox Verify and Purchase shortcuts */}
                  <div className="shrink-0 flex items-center justify-between border-t border-[#E2E8F0] pt-4 mt-4 text-[10px] font-mono font-bold text-[#9CA3AF]">
                    <span>SECURE VISUAL PDF READER</span>
                    <button
                      onClick={() => {
                        setPreviewProduct(null);
                        setSelectedProduct(previewProduct);
                        setCheckoutStep("method");
                      }}
                      className="bg-brand-red hover:bg-blood-red text-white text-[10px] font-bold px-5 py-2.5 rounded-xl transition-all shadow-[0_4px_15px_rgba(234,63,64,0.2)] flex items-center gap-1.5"
                    >
                      <CreditCard size={12} /> Buy Now (৳{previewProduct.price})
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto p-8 bg-[#F8F9FA] flex flex-col justify-center items-center">
                    <AnimatePresence mode="wait">
                      
                      {/* PAGE 1: CHARACTER GEOMETRY */}
                      {previewPage === 1 && (
                        <motion.div 
                          key="page1"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="bg-white border border-border w-full max-w-md aspect-[3/4] p-8 rounded-2xl shadow-sm flex flex-col justify-between text-xs text-muted"
                        >
                          <div className="space-y-4">
                            <div className="flex justify-between border-b border-border/60 pb-3 text-[10px] font-bold text-foreground font-mono">
                              <span>SECTION 01</span>
                              <span>PAGE 01 / 04</span>
                            </div>
                            <h4 className="text-lg font-serif font-bold text-foreground">Ch 1: The Character Art Geometry</h4>
                            <p className="leading-relaxed">
                              Visual storytelling begins with primitive shapes. When sketching key storyboards, establish dynamic motion cues inside circular skeletons to maintain consistent proportions.
                            </p>
                            
                            {/* Interactive Circle Vector Grid Demo */}
                            <div className="h-32 border border-dashed border-border/80 rounded-xl flex items-center justify-center gap-6 bg-[#FAF9F6]">
                              <div className="w-16 h-16 rounded-full border-2 border-brand-red flex items-center justify-center relative animate-pulse">
                                <div className="w-2 h-2 bg-brand-red rounded-full" />
                                <div className="absolute inset-0 border border-brand-red/30 border-dashed rounded-full scale-125" />
                              </div>
                              <div className="space-y-1 text-[9px] font-mono text-muted">
                                <p>• Ratios: 1:1.618 Golden</p>
                                <p>• Motion Center: Offset 8°</p>
                                <p>• Grid Alignment: Rule of 3</p>
                              </div>
                            </div>
                          </div>
                          <span className="text-[9px] font-mono font-bold text-[#C2B59B] text-center tracking-wider">Antor studio dynamic publishing house</span>
                        </motion.div>
                      )}

                      {/* PAGE 2: FRAME BREAKDOWN */}
                      {previewPage === 2 && (
                        <motion.div 
                          key="page2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="bg-white border border-border w-full max-w-md aspect-[3/4] p-8 rounded-2xl shadow-sm flex flex-col justify-between text-xs text-muted"
                        >
                          <div className="space-y-4">
                            <div className="flex justify-between border-b border-border/60 pb-3 text-[10px] font-bold text-foreground font-mono">
                              <span>SECTION 02</span>
                              <span>PAGE 02 / 04</span>
                            </div>
                            <h4 className="text-lg font-serif font-bold text-foreground">Ch 2: Camera Grids & E-Learning Frames</h4>
                            <p className="leading-relaxed">
                              In educational campaigns, extreme closeups are reserved for text focal segments. All animation keyframes must follow safe-zones to avoid clipping on legacy display screens.
                            </p>
                            
                            {/* Camera safe-zone border overlay */}
                            <div className="h-32 border-2 border-border rounded-xl p-3 relative bg-[#FAF9F6] flex flex-col justify-between">
                              <div className="border border-dashed border-brand-red/30 h-full w-full rounded flex items-center justify-center text-[8px] font-mono font-bold text-[#E11D48]/80">
                                90% Action Safe Boundary
                              </div>
                            </div>
                          </div>
                          <span className="text-[9px] font-mono font-bold text-[#C2B59B] text-center tracking-wider">Antor studio dynamic publishing house</span>
                        </motion.div>
                      )}

                      {/* PAGE 3: SFX & SYNC */}
                      {previewPage === 3 && (
                        <motion.div 
                          key="page3"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="bg-white border border-border w-full max-w-md aspect-[3/4] p-8 rounded-2xl shadow-sm flex flex-col justify-between text-xs text-muted"
                        >
                          <div className="space-y-4">
                            <div className="flex justify-between border-b border-border/60 pb-3 text-[10px] font-bold text-foreground font-mono">
                              <span>SECTION 03</span>
                              <span>PAGE 03 / 04</span>
                            </div>
                            <h4 className="text-lg font-serif font-bold text-foreground">Ch 3: Sound Cue Sync Matrix</h4>
                            <p className="leading-relaxed">
                              Sound cues drive retention rates. High-intensity voiceovers should map directly to physical vector shifts. Avoid overlapping high frequencies with narrator cues.
                            </p>
                            
                            {/* Audio Waveform mock */}
                            <div className="h-32 border border-border rounded-xl p-4 bg-[#FAF9F6] flex items-end gap-1.5 justify-center">
                              {[20, 60, 40, 80, 50, 90, 30, 70, 45, 85, 35, 65, 25, 55].map((h, i) => (
                                <div 
                                  key={i} 
                                  style={{ height: `${h}%` }} 
                                  className="w-full bg-brand-red/10 border-t border-brand-red/35 rounded-t-sm" 
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-[9px] font-mono font-bold text-[#C2B59B] text-center tracking-wider">Antor studio dynamic publishing house</span>
                        </motion.div>
                      )}

                      {/* PAGE 4: BLUR LOCK SCREEN */}
                      {previewPage === 4 && (
                        <motion.div 
                          key="page4"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="bg-white border border-border w-full max-w-md aspect-[3/4] p-8 rounded-2xl shadow-sm flex flex-col justify-between text-xs text-muted relative overflow-hidden"
                        >
                          <div className="space-y-4 blur-[3px] select-none pointer-events-none">
                            <div className="flex justify-between border-b border-border pb-3 text-[10px] font-bold text-foreground">
                              <span>SECTION 04</span>
                              <span>PAGE 04 / 04</span>
                            </div>
                            <h4 className="text-lg font-serif font-bold text-foreground">Ch 4: Lighting Schemes & Render Cues</h4>
                            <p className="leading-relaxed">
                              Render values dictate file sizes. Compressing frames utilizing vector outlines decreases the server delivery latency by 42%. Use H.264 profiles for streaming formats.
                            </p>
                            <div className="h-32 border border-border rounded-xl bg-background" />
                          </div>

                          {/* Lock Overlays */}
                          <div className="absolute inset-0 bg-white/70 backdrop-blur-[3px] flex flex-col items-center justify-center p-6 space-y-6 text-center z-20">
                            <div className="w-14 h-14 bg-brand-red/10 border border-brand-red/20 text-brand-red rounded-2xl flex items-center justify-center shadow-sm">
                              <Lock size={22} className="animate-pulse" />
                            </div>
                            <div className="space-y-2">
                              <h4 className="text-base font-serif font-bold text-foreground">Read The Whole Guide 📚</h4>
                              <p className="text-[10px] text-muted max-w-[200px] leading-relaxed mx-auto">
                                Purchase this book now to instantly unlock the full printable PDF and all design systems.
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                setPreviewProduct(null);
                                setSelectedProduct(previewProduct);
                                setCheckoutStep("method");
                              }}
                              className="bg-brand-red hover:bg-blood-red text-white text-xs font-bold px-6 py-3 rounded-xl shadow-lg shadow-brand-red/20 transition-all"
                            >
                              Unlock PDF (৳{previewProduct.price})
                            </button>
                          </div>
                          <span className="text-[9px] font-mono font-bold text-[#C2B59B] text-center tracking-wider blur-[2px]">Antor studio dynamic publishing house</span>
                        </motion.div>
                      )}

                    </AnimatePresence>
                  </div>

                  {/* Footer pagination */}
                  <div className="p-4 border-t border-border bg-background flex justify-between items-center shrink-0 text-xs font-bold font-mono">
                    <button
                      disabled={previewPage === 1}
                      onClick={() => setPreviewPage(prev => prev - 1)}
                      className="px-4 py-2 border border-border rounded-xl flex items-center gap-1 bg-surface text-muted hover:text-foreground disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <ChevronLeft size={14} /> Back
                    </button>
                    
                    <span className="text-foreground">PAGE {previewPage} / 4</span>

                    <button
                      disabled={previewPage === 4}
                      onClick={() => setPreviewPage(prev => prev + 1)}
                      className="px-4 py-2 border border-border rounded-xl flex items-center gap-1 bg-surface text-muted hover:text-foreground disabled:opacity-50 disabled:pointer-events-none"
                    >
                      Next <ChevronRight size={14} />
                    </button>
                  </div>
                </>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: DETAILED CHECKOUT MODAL (BKASH/NAGAD CHECKOUT) */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface border border-border rounded-[2.5rem] w-full max-w-md p-8 relative shadow-2xl text-center space-y-6"
            >
              {/* Close Button */}
              <button 
                onClick={handleCloseModal}
                className="absolute top-6 right-6 p-2.5 text-muted hover:text-foreground bg-background border border-border rounded-xl hover:border-brand-red transition-all"
              >
                <X size={16} />
              </button>

              {/* STEP 1: METHOD SELECTION */}
              {checkoutStep === "method" && (
                <div className="space-y-6 pt-4">
                  <div className="w-12 h-12 rounded-full bg-brand-red/10 text-brand-red flex items-center justify-center mx-auto">
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{lang === "bn" ? "পেমেন্ট মাধ্যম নির্বাচন করুন" : "Select Payment Mode"}</h3>
                    <p className="text-xs text-muted mt-1">Select your preferred mobile wallet for BDT checkout.</p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setPaymentMethod("bkash");
                        setCheckoutStep("details");
                      }}
                      className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold p-5 rounded-2xl flex flex-col items-center gap-2 transition-all shadow-lg hover:scale-105"
                    >
                      <span className="text-2xl font-serif">bKash</span>
                      <span className="text-[10px] uppercase font-mono tracking-wider opacity-90">Personal wallet</span>
                    </button>
                    <button
                      onClick={() => {
                        setPaymentMethod("nagad");
                        setCheckoutStep("details");
                      }}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold p-5 rounded-2xl flex flex-col items-center gap-2 transition-all shadow-lg hover:scale-105"
                    >
                      <span className="text-2xl font-serif">Nagad</span>
                      <span className="text-[10px] uppercase font-mono tracking-wider opacity-90">Personal wallet</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: DETAIL SUMMARY & MANUAL PAYMENT GUIDE */}
              {checkoutStep === "details" && paymentMethod && (
                <div className="space-y-6 pt-4 text-left overflow-y-auto max-h-[70vh] pr-1">
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-bold text-foreground uppercase tracking-wider font-mono">
                      Pay with {paymentMethod === "bkash" ? "bKash" : "Nagad"}
                    </h3>
                    <p className="text-xs text-muted">
                      ESTIMATED VALUE: <span className="text-brand-red font-bold font-mono">৳ {selectedProduct.price}</span>
                    </p>
                  </div>

                  {/* Manual Instructions Box */}
                  <div className="bg-background border border-border p-5 rounded-2xl space-y-3 font-semibold text-xs leading-relaxed text-muted">
                    <p className="text-foreground font-bold">Follow these steps carefully:</p>
                    <p>1. Open your {paymentMethod === "bkash" ? "bKash" : "Nagad"} App or dial USSD code.</p>
                    <p>2. Select <span className="text-brand-red font-bold">"Send Money"</span> option.</p>
                    <p>3. Enter Personal Number: <span className="text-foreground font-mono font-bold tracking-wider">01712-345678</span></p>
                    <p>4. Input Amount: <span className="text-foreground font-mono font-bold">৳ {selectedProduct.price}</span></p>
                  </div>

                  {/* Form Inputs */}
                  <div className="space-y-4 text-xs font-bold">
                    <div>
                      <label className="block text-muted uppercase tracking-wider mb-2 text-[10px]">Your Name *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. John Doe"
                        value={clientName}
                        onChange={e => setClientName(e.target.value)}
                        className="w-full bg-background border border-border rounded-xl px-4 py-3.5 text-xs text-foreground focus:border-brand-red outline-none"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-muted uppercase tracking-wider mb-2 text-[10px]">Your Email Address *</label>
                        <input 
                          type="email" 
                          placeholder="e.g. john@example.com"
                          value={clientEmail}
                          onChange={e => setClientEmail(e.target.value)}
                          className="w-full bg-background border border-border rounded-xl px-4 py-3.5 text-xs text-foreground focus:border-brand-red outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-muted uppercase tracking-wider mb-2 text-[10px]">WhatsApp Number *</label>
                        <input 
                          type="text" 
                          placeholder="e.g. 01712345678"
                          value={whatsappNumber}
                          onChange={e => setWhatsappNumber(e.target.value)}
                          className="w-full bg-background border border-border rounded-xl px-4 py-3.5 text-xs text-foreground focus:border-brand-red outline-none font-mono"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-muted uppercase tracking-wider mb-2 text-[10px]">Sender Wallet Mobile Number *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 01712345678"
                        value={senderNumber}
                        onChange={e => setSenderNumber(e.target.value)}
                        className="w-full bg-background border border-border rounded-xl px-4 py-3.5 text-xs text-foreground focus:border-brand-red outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-muted uppercase tracking-wider mb-2 text-[10px]">Transaction ID (TrxID) *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. AM27D83K9"
                        value={trxId}
                        onChange={e => setTrxId(e.target.value.toUpperCase())}
                        className="w-full bg-background border border-border rounded-xl px-4 py-3.5 text-xs text-foreground focus:border-brand-red outline-none font-mono"
                      />
                    </div>

                    {paymentError && (
                      <p className="text-brand-red font-bold text-center mt-2">{paymentError}</p>
                    )}

                    <button
                      onClick={handleCheckoutSubmit}
                      className="w-full bg-brand-red hover:bg-blood-red text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg text-xs"
                    >
                      <ShieldCheck size={16} /> Submit & Request Verify
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: MOCK VERIFICATION LOADER (REAL-TIME POLLING FROM DATABASE) */}
              {checkoutStep === "verifying" && (
                <div className="py-12 space-y-6">
                  <RefreshCw size={44} className="mx-auto text-brand-red animate-spin" />
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Waiting for Admin Verification</h3>
                    <p className="text-xs text-muted mt-2 leading-relaxed max-w-xs mx-auto">
                      Submitted TrxID <span className="font-mono text-foreground font-bold">{trxId}</span> to ledger. 
                      Please wait, your access will unlock dynamically as soon as the Admin approves the transaction in the console!
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 4: REJECTED STATE */}
              {checkoutStep === "rejected" && (
                <div className="py-8 space-y-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-red-100 text-red-500 flex items-center justify-center mx-auto border border-red-200">
                    <X size={36} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Verification Failed</h3>
                    <p className="text-xs text-muted mt-2 max-w-xs mx-auto leading-relaxed">
                      The transaction with ID <span className="font-mono text-foreground font-bold">{trxId}</span> was rejected. 
                      Please ensure you typed the correct Transaction ID or submitted the payment.
                    </p>
                  </div>
                  
                  <button
                    onClick={() => setCheckoutStep("details")}
                    className="w-full bg-brand-red hover:bg-blood-red text-white py-4 rounded-xl font-bold text-xs"
                  >
                    Retry Verification
                  </button>
                </div>
              )}

              {/* STEP 5: SUCCESS & DOWNLOAD PORTAL */}
              {checkoutStep === "success" && (
                <div className="py-6 space-y-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-500/20">
                    <ShieldCheck size={36} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-black text-foreground">Payment Verified!</h3>
                    <p className="text-xs text-muted mt-2 max-w-xs mx-auto leading-relaxed">
                      Your transaction has been approved by the Admin console. Your downloadable PDF resource is now fully unlocked.
                    </p>
                  </div>

                  <a
                    href={selectedProduct.pdfUrl}
                    download
                    onClick={handleCloseModal}
                    className="inline-flex w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold items-center justify-center gap-2 transition-all shadow-[0_4px_20px_rgba(16,185,129,0.2)] text-sm"
                  >
                    <Download size={16} /> Download PDF File
                  </a>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </main>
  );
}
