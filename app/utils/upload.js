import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function saveImage(file, productName) {
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  // original extension rakho (jpg/png/webp sab support)
  const originalName = file.name || "image.jpg";
  const ext = path.extname(originalName) || ".jpg";
  const safeName = productName.replace(/[^a-zA-Z0-9]/g, "_");
  const fileName = `${safeName}_${Date.now()}${ext}`;
  const filePath = path.join(uploadDir, fileName);

  const bytes = await file.arrayBuffer();
  await writeFile(filePath, Buffer.from(bytes));

  return `/uploads/${fileName}`;
}
