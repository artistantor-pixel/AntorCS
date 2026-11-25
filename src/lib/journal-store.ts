import fs from "fs";
import path from "path";
import type { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { DEFAULT_JOURNAL_ENTRIES, type JournalEntry } from "@/config/journal";

const DATA_FILE = path.join(process.cwd(), "src", "data", "journal.json");

function extractEntries(data: unknown): JournalEntry[] | null {
  if (
    data &&
    typeof data === "object" &&
    !Array.isArray(data) &&
    "entries" in data &&
    Array.isArray((data as { entries?: unknown }).entries)
  ) {
    return (data as { entries: JournalEntry[] }).entries;
  }
  return null;
}

function readLocalJournal(): JournalEntry[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const parsed: unknown = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as JournalEntry[];
      }
    }
  } catch (err) {
    console.error("Failed reading local journal.json:", err);
  }
  return DEFAULT_JOURNAL_ENTRIES;
}

function writeLocalJournal(entries: JournalEntry[]): void {
  try {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(entries, null, 2), "utf8");
  } catch (err) {
    console.error("Failed writing local journal.json:", err);
  }
}

/** Reads journal entries from Prisma Content store with local JSON fallback. */
export async function readJournalEntries(): Promise<JournalEntry[]> {
  try {
    const rec = await prisma.content.findUnique({ where: { id: "journal_posts" } });
    const parsed = extractEntries(rec?.data);
    if (parsed) {
      return parsed;
    }
  } catch {
    // Fallback cleanly to local JSON when Postgres is offline
  }
  return readLocalJournal();
}

/** Persists journal entries to local JSON and Prisma Content store when available. */
export async function persistJournalEntries(entries: JournalEntry[]): Promise<void> {
  writeLocalJournal(entries);
  try {
    const payload = JSON.parse(JSON.stringify({ entries })) as Prisma.InputJsonValue;
    await prisma.content.upsert({
      where: { id: "journal_posts" },
      update: { data: payload },
      create: { id: "journal_posts", data: payload },
    });
  } catch {
    // Local JSON already persisted when DB is unavailable
  }
}
