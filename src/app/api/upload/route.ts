import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string | null; // "image" or "pdf"

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate extension and size
    const fileExt = path.extname(file.name).toLowerCase();
    
    if (type === "image") {
      const allowedExts = [".png", ".jpg", ".jpeg", ".webp", ".gif"];
      if (!allowedExts.includes(fileExt)) {
        return NextResponse.json({ 
          error: "Invalid image format. Allowed formats: PNG, JPG, JPEG, WEBP, GIF." 
        }, { status: 400 });
      }
      // Limit images to 5MB
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: "Image file exceeds the 5MB size limit." }, { status: 400 });
      }
    } else if (type === "pdf") {
      if (fileExt !== ".pdf") {
        return NextResponse.json({ error: "Invalid document format. Only PDF files are allowed." }, { status: 400 });
      }
      // Limit PDFs to 20MB
      if (file.size > 20 * 1024 * 1024) {
        return NextResponse.json({ error: "PDF file exceeds the 20MB size limit." }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: "Invalid upload type. Must be 'image' or 'pdf'." }, { status: 400 });
    }

    // Ensure upload directory exists inside public/uploads
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Generate safe, collision-free unique name
    const sanitizedOriginalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFilename = `${Date.now()}-${sanitizedOriginalName}`;
    const filePath = path.join(uploadDir, uniqueFilename);
    
    // Write buffer to local folder
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${uniqueFilename}`;
    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error("Local file upload error:", error);
    return NextResponse.json({ error: "Internal server error during upload." }, { status: 500 });
  }
}
