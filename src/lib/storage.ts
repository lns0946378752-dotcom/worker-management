import { promises as fs } from "fs";
import path from "path";

import type { UploadRecord } from "@/lib/types";

const appRoot = process.cwd();
const uploadDirectory = path.join(appRoot, "src", "data", "uploads");
const metadataFile = path.join(appRoot, "src", "data", "uploads.json");

export async function saveUploadFile(file: File, userId: string) {
  await fs.mkdir(uploadDirectory, { recursive: true });

  const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, "-");
  const fileId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const storageKey = `${userId}/${fileId}-${safeName}`;
  const storagePath = path.join(uploadDirectory, storageKey.replace(/\//g, "_"));

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await fs.writeFile(storagePath, buffer);

  const metadata: UploadRecord = {
    id: fileId,
    userId,
    fileName: file.name,
    storagePath: storagePath,
    storageKey,
    contentType: file.type || "application/octet-stream",
    size: file.size,
    createdAt: new Date().toISOString(),
    url: `/api/uploads/${encodeURIComponent(storageKey)}`,
  };

  const raw = await fs.readFile(metadataFile, "utf8").catch(() => "[]");
  const records = JSON.parse(raw) as UploadRecord[];
  records.push(metadata);
  await fs.writeFile(metadataFile, JSON.stringify(records, null, 2), "utf8");

  return metadata;
}

export async function getUploadRecordByUser(userId: string) {
  const raw = await fs.readFile(metadataFile, "utf8").catch(() => "[]");
  const records = JSON.parse(raw) as UploadRecord[];
  return records.filter((record) => record.userId === userId).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function getUploadFileByKey(storageKey: string) {
  const safeKey = storageKey.replace(/\//g, "_");
  const absolutePath = path.join(uploadDirectory, safeKey);
  return fs.readFile(absolutePath).catch(() => null);
}
