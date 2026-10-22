import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { put } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.isAdmin) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return json({ error: "No file provided" }, { status: 400 });
    }

    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const blob = await put(filename, file, { access: "public" });
        return json({ url: blob.url });
      } catch (blobErr) {
        console.warn("Vercel blob put failed, falling back to local/data URL:", blobErr);
      }
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    try {
      const uploadsDir = path.join(process.cwd(), "static", "uploads");
      await fs.mkdir(uploadsDir, { recursive: true });
      const filePath = path.join(uploadsDir, filename);
      await fs.writeFile(filePath, buffer);
      return json({ url: `/uploads/${filename}` });
    } catch (diskErr) {
      const mime = file.type || "image/jpeg";
      const base64 = buffer.toString("base64");
      return json({ url: `data:${mime};base64,${base64}` });
    }
  } catch (error) {
    console.error("Upload error:", error);
    return json({ error: "Failed to process file" }, { status: 500 });
  }
};
