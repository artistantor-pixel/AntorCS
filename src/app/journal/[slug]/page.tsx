import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { readJournalEntries } from "@/lib/journal-store";
import JournalDetailClient from "./JournalDetailClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entries = await readJournalEntries();
  const entry = entries.find((e) => e.slug === slug || e.id === slug);

  if (!entry) {
    return { title: "Journal Entry Not Found | Antor" };
  }

  return {
    title: `${entry.title} | Antor Journal`,
    description: entry.excerpt,
  };
}

export default async function JournalArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entries = await readJournalEntries();
  const idx = entries.findIndex((e) => e.slug === slug || e.id === slug);

  if (idx === -1) {
    notFound();
  }

  const entry = entries[idx];
  const nextEntry = entries.length > 1 ? entries[(idx + 1) % entries.length] : null;

  return <JournalDetailClient entry={entry} nextEntry={nextEntry} />;
}
