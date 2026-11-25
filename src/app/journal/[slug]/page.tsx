import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { DEFAULT_JOURNAL_ENTRIES, type JournalEntry } from "@/config/journal";
import JournalDetailClient from "./JournalDetailClient";

export const dynamic = "force-dynamic";

async function loadEntries(): Promise<JournalEntry[]> {
  try {
    const rec = await prisma.content.findUnique({ where: { id: "journal_posts" } });
    if (rec && Array.isArray((rec.data as { entries?: JournalEntry[] })?.entries)) {
      return (rec.data as { entries: JournalEntry[] }).entries;
    }
  } catch {
    // Fallback to local JSON
  }

  try {
    const filePath = path.join(process.cwd(), "src", "data", "journal.json");
    if (fs.existsSync(filePath)) {
      const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // Fallback to default seed
  }

  return DEFAULT_JOURNAL_ENTRIES;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entries = await loadEntries();
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
  const entries = await loadEntries();
  const idx = entries.findIndex((e) => e.slug === slug || e.id === slug);

  if (idx === -1) {
    notFound();
  }

  const entry = entries[idx];
  const nextEntry = entries.length > 1 ? entries[(idx + 1) % entries.length] : null;

  return <JournalDetailClient entry={entry} nextEntry={nextEntry} />;
}
