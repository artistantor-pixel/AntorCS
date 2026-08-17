import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { success: false, error: "পাসওয়ার্ড প্রয়োজন।" },
        { status: 400 }
      );
    }

    const envPassword = process.env.ADMIN_PASSWORD;
    const isMatched = envPassword 
      ? password === envPassword 
      : (password === "boss123" || password === "admin123");

    if (isMatched) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: "ভুল পাসওয়ার্ড! আবার চেষ্টা করুন।" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Admin authentication error:", error);
    return NextResponse.json(
      { success: false, error: "সার্ভার এরর ঘটেছে।" },
      { status: 500 }
    );
  }
}
