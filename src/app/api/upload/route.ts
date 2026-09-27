import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { put } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";

export async function POST(request: Request) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    // 1. If Vercel Blob token is configured, upload to Vercel Blob
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const blob = await put(filename, file, { access: "public" });
        return NextResponse.json({ url: blob.url });
      } catch (blobErr) {
        console.warn("Vercel blob put failed, falling back to local/data URL:", blobErr);
      }
    }

    // 2. Local disk fallback for local development
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    try {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadsDir, { recursive: true });
      const filePath = path.join(uploadsDir, filename);
      await fs.writeFile(filePath, buffer);
      return NextResponse.json({ url: `/uploads/${filename}` });
    } catch (diskErr) {
      // 3. Serverless fallback: if filesystem is read-only (e.g. Vercel Lambda EROFS without Blob token)
      console.warn("Disk write failed (serverless read-only filesystem), returning Base64 data URL:", diskErr);
      const mime = file.type || "image/jpeg";
      const base64 = buffer.toString("base64");
      return NextResponse.json({ url: `data:${mime};base64,${base64}` });
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to process file" }, { status: 500 });
  }
}
