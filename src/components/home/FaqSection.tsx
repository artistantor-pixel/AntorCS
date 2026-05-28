"use client";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface FaqItem { q: string; a: string; }
interface Props {
  faqs: FaqItem[];
  openFaq: number | null;
  setOpenFaq: (v: number | null) => void;
}

export default function FaqSection({ faqs, openFaq, setOpenFaq }: Props) {
  const { t } = useLanguage();
  return (
    <section className="w-full max-w-3xl mx-auto px-6 mb-40">
      <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center font-serif">{t("faq.title")}</h2>
      <div className="flex flex-col gap-4">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-border rounded-2xl overflow-hidden bg-surface transition-all">
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full px-6 py-5 flex justify-between items-center text-left font-bold"
            >
              {faq.q}
              <ChevronDown className={`transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} />
            </button>
            {openFaq === i && (
              <div className="px-6 pb-5 text-muted">{faq.a}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
