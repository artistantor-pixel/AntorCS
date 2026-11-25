import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import prisma from "@/lib/prisma";
import {
  DEFAULT_JOURNAL_ENTRIES,
  slugifyTitle,
  type JournalEntry,
} from "@/config/journal";

export const dynamic = "force-dynamic";

const DATA_FILE = path.join(process.cwd(), "src", "data", "journal.json");

function readLocalJournal(): JournalEntry[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
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

async function readJournalEntries(): Promise<JournalEntry[]> {
  try {
    const rec = await prisma.content.findUnique({ where: { id: "journal_posts" } });
    if (rec && Array.isArray((rec.data as { entries?: JournalEntry[] })?.entries)) {
      return (rec.data as { entries: JournalEntry[] }).entries;
    }
  } catch {
    // Fallback cleanly to local JSON when Postgres is offline
  }
  return readLocalJournal();
}

async function persistJournalEntries(entries: JournalEntry[]): Promise<void> {
  writeLocalJournal(entries);
  try {
    await prisma.content.upsert({
      where: { id: "journal_posts" },
      update: { data: { entries } as unknown as object },
      create: { id: "journal_posts", data: { entries } as unknown as object },
    });
  } catch {
    // Local JSON already persisted when DB is unavailable
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slugOrId = searchParams.get("slug");
  const entries = await readJournalEntries();

  if (slugOrId) {
    const entry = entries.find(
      (item) => item.slug === slugOrId || item.id === slugOrId
    );
    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }
    return NextResponse.json({ entry });
  }

  return NextResponse.json({ entries });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const title = String(body.title || "").trim();
    const excerpt = String(body.excerpt || "").trim();
    const content = String(body.content || "").trim();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and story content are required." },
        { status: 400 }
      );
    }

    const entries = await readJournalEntries();
    const now = new Date();
    const baseSlug = slugifyTitle(title);
    const slugExists = entries.some((e) => e.slug === baseSlug);
    const slug = slugExists ? `${baseSlug}-${now.getTime().toString().slice(-4)}` : baseSlug;

    const newEntry: JournalEntry = {
      id: `j-${now.getTime()}`,
      slug,
      title,
      category: body.category || "Thoughts",
      mood: String(body.mood || "Reflection").trim() || "Reflection",
      date:
        String(body.date || "").trim() ||
        now.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      isoDate: now.toISOString().slice(0, 10),
      excerpt: excerpt || content.slice(0, 160).replace(/\n+/g, " ") + "...",
      content,
      image:
        String(body.image || "").trim() ||
        "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=1800&auto=format&fit=crop",
      featured: Boolean(body.featured),
      likes: 0,
    };

    const updated = newEntry.featured
      ? [newEntry, ...entries.map((e) => ({ ...e, featured: false }))]
      : [newEntry, ...entries];

    await persistJournalEntries(updated);
    return NextResponse.json({ entry: newEntry, entries: updated }, { status: 201 });
  } catch (err) {
    console.error("Failed to create journal entry:", err);
    return NextResponse.json({ error: "Failed to publish entry." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const id = String(body.id || "");
    if (!id) {
      return NextResponse.json({ error: "Entry id is required." }, { status: 400 });
    }

    const entries = await readJournalEntries();
    const idx = entries.findIndex((e) => e.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: "Entry not found." }, { status: 404 });
    }

    const isFeatured = Boolean(body.featured);
    const updated = entries.map((item) => {
      if (item.id !== id) {
        return isFeatured ? { ...item, featured: false } : item;
      }
      return {
        ...item,
        title: String(body.title || item.title).trim(),
        category: body.category || item.category,
        mood: String(body.mood || item.mood).trim(),
        date: String(body.date || item.date).trim(),
        excerpt: String(body.excerpt || item.excerpt).trim(),
        content: String(body.content || item.content).trim(),
        image: String(body.image || item.image).trim(),
        featured: isFeatured,
      };
    });

    await persistJournalEntries(updated);
    return NextResponse.json({ entries: updated });
  } catch (err) {
    console.error("Failed to update journal entry:", err);
    return NextResponse.json({ error: "Failed to update entry." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const id = String(body.id || "");
    const action = String(body.action || "like");

    const entries = await readJournalEntries();
    const updated = entries.map((item) => {
      if (item.id !== id) {
        return action === "feature" ? { ...item, featured: false } : item;
      }
      if (action === "feature") {
        return { ...item, featured: !item.featured };
      }
      return { ...item, likes: (item.likes || 0) + 1 };
    });

    await persistJournalEntries(updated);
    const updatedEntry = updated.find((e) => e.id === id);
    return NextResponse.json({ entry: updatedEntry, entries: updated });
  } catch (err) {
    console.error("Failed to patch journal entry:", err);
    return NextResponse.json({ error: "Failed to update reaction." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Entry id is required." }, { status: 400 });
    }

    const entries = await readJournalEntries();
    const filtered = entries.filter((item) => item.id !== id);
    await persistJournalEntries(filtered);
    return NextResponse.json({ entries: filtered });
  } catch (err) {
    console.error("Failed to delete journal entry:", err);
    return NextResponse.json({ error: "Failed to delete entry." }, { status: 500 });
  }
}
