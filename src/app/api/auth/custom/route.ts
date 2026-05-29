import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";
const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { action, name, email, password } = await request.json();

    if (!action || !email || !password) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail.endsWith("@gmail.com")) {
      return NextResponse.json({ error: "Only @gmail.com accounts are allowed." }, { status: 400 });
    }

    // Get current registered users
    const record = await prisma.content.findUnique({
      where: { id: "workspace_users" }
    });

    let users: any[] = [];
    if (record && Array.isArray(record.data)) {
      users = record.data;
    }

    if (action === "signup") {
      if (!name || !name.trim()) {
        return NextResponse.json({ error: "Name is required for registration." }, { status: 400 });
      }

      // Check if email already exists
      const exists = users.some((u: any) => u.email === normalizedEmail);
      if (exists) {
        return NextResponse.json({ error: "Email is already registered. Please sign in." }, { status: 400 });
      }

      // Create new user
      const newUser = {
        name: name.trim(),
        email: normalizedEmail,
        password: password // simple and direct for development/testing
      };

      const updatedUsers = [...users, newUser];

      await prisma.content.upsert({
        where: { id: "workspace_users" },
        update: { data: updatedUsers },
        create: { id: "workspace_users", data: updatedUsers }
      });

      return NextResponse.json({
        success: true,
        user: { email: newUser.email, name: newUser.name }
      });
    }

    if (action === "login") {
      const match = users.find(
        (u: any) => u.email === normalizedEmail && u.password === password
      );

      if (!match) {
        return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
      }

      return NextResponse.json({
        success: true,
        user: { email: match.email, name: match.name }
      });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error) {
    console.error("Custom authentication error:", error);
    return NextResponse.json({ error: "Authentication system error." }, { status: 500 });
  }
}
