import type { UploadRecord, UserRecord, WorkerRecord } from "@/lib/types";
import { getSupabaseServerClient } from "@/lib/supabase/server";

// Note: removed seeded default workers to avoid showing fake data in UI.

// Note: removed hard-coded fallback users to avoid displaying fake profiles.

function mapProfileToUser(row: Record<string, unknown>): UserRecord {
  return {
    id: String(row.id ?? ""),
    name: String(row.name ?? ""),
    email: String(row.email ?? ""),
    password: String(row.password_hash ?? ""),
    role: (row.role as UserRecord["role"]) ?? "staff",
    department: String(row.department ?? ""),
    avatarUrl: row.avatar_url ? String(row.avatar_url) : undefined,
  };
}

function mapWorkerToRecord(row: Record<string, unknown>): WorkerRecord {
  return {
    id: String(row.id ?? ""),
    name: String(row.name ?? ""),
    role: String(row.role ?? ""),
    status: (row.status as WorkerRecord["status"]) ?? "active",
    shift: String(row.shift ?? ""),
    department: String(row.department ?? ""),
    avatarUrl: row.avatar_url ? String(row.avatar_url) : undefined,
    createdAt: row.created_at ? String(row.created_at) : row.createdAt ? String(row.createdAt) : undefined,
  };
}

export async function readUsers() {
  const client = getSupabaseServerClient();

  if (client) {
    const { data, error } = await client.from("profiles").select("*");
    if (!error && data) {
      return data.map((row) => mapProfileToUser(row));
    }
  }

  // No DB client or no profiles — return empty list (do not expose hard-coded users)
  return [] as UserRecord[];
}

export async function writeUsers(users: UserRecord[]) {
  const client = getSupabaseServerClient();
  if (!client) {
    return users;
  }

  const { error } = await client.from("profiles").upsert(
    users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      password_hash: user.password,
      role: user.role,
      department: user.department,
      avatar_url: user.avatarUrl ?? null,
    }))
  );

  if (error) {
    console.error("writeUsers failed:", error.message);
  }

  return users;
}

export async function readWorkers() {
  const client = getSupabaseServerClient();

  if (client) {
    const { data, error } = await client.from("workers").select("*");
    if (!error && data) {
      return data.map((row) => mapWorkerToRecord(row));
    }
  }

  // If no DB client or no data, return empty array — do NOT return seeded data.
  return [] as WorkerRecord[];
}

export async function writeWorkers(workers: WorkerRecord[]) {
  const client = getSupabaseServerClient();
  if (!client) {
    return workers;
  }

  const { error } = await client.from("workers").upsert(
    workers.map((worker) => ({
      id: worker.id,
      name: worker.name,
      role: worker.role,
      status: worker.status,
      shift: worker.shift,
      department: worker.department,
      avatar_url: worker.avatarUrl ?? null,
      created_at: worker.createdAt ?? null,
    }))
  );

  if (error) {
    console.error("writeWorkers failed:", error.message);
  }

  return workers;
}

export async function readUploads() {
  const client = getSupabaseServerClient();
  if (!client) {
    return [] as UploadRecord[];
  }

  const { data, error } = await client.from("attachments").select("*");
  if (error) {
    console.error("readUploads failed:", error.message);
    return [] as UploadRecord[];
  }

  return (data ?? []).map((row) => ({
    id: String(row.id),
    userId: String(row.user_id),
    fileName: String(row.file_name),
    storagePath: String(row.storage_path),
    storageKey: String(row.storage_path),
    contentType: String(row.content_type),
    size: Number(row.file_size),
    createdAt: new Date(row.created_at).toISOString(),
    url: String(row.storage_path),
  })) as UploadRecord[];
}

export async function writeUploads(uploads: UploadRecord[]) {
  const client = getSupabaseServerClient();
  if (!client) {
    return uploads;
  }

  const { error } = await client.from("attachments").upsert(
    uploads.map((upload) => ({
      id: upload.id,
      user_id: upload.userId,
      storage_path: upload.storagePath,
      file_name: upload.fileName,
      content_type: upload.contentType,
      file_size: upload.size,
    }))
  );

  if (error) {
    console.error("writeUploads failed:", error.message);
  }

  return uploads;
}
