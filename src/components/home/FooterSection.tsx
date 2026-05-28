"use client";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function FooterSection() {
  const { t } = useLanguage();
  return (
    <footer className="w-full bg-surface border-t border-border pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="block mb-6 hover:opacity-80 transition-opacity">
              <img src="/logo.png" alt="Antor Logo" className="h-10 w-auto object-contain" />
            </Link>
            <p className="text-muted max-w-sm">{t("footer.desc")}</p>
          </div>
          <div>
            <h4 className="font-bold mb-6">{t("footer.links_title")}</h4>
            <div className="flex flex-col gap-3 text-muted">
              <Link href="/about" className="hover:text-brand-red transition-colors">{t("nav.about")}</Link>
              <Link href="/portfolio" className="hover:text-brand-red transition-colors">{t("nav.works")}</Link>
              <Link href="/services" className="hover:text-brand-red transition-colors">{t("nav.services")}</Link>
              <Link href="/contact" className="hover:text-brand-red transition-colors">{t("nav.journal")}</Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-6">{t("footer.legal_title")}</h4>
            <div className="flex flex-col gap-3 text-muted">
              <Link href="/privacy" className="hover:text-brand-red transition-colors">{t("footer.privacy")}</Link>
              <Link href="/terms" className="hover:text-brand-red transition-colors">{t("footer.terms")}</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted">
          <p>© {new Date().getFullYear()} Antor. {t("footer.rights")}</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-brand-red transition-colors">Twitter</a>
            <a href="#" className="hover:text-brand-red transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-brand-red transition-colors">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
