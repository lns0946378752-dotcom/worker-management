import type { UploadRecord, UserRecord, WorkerRecord } from "@/lib/types";
import { requireSupabaseServerClient } from "@/lib/supabase/server";

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
  const client = requireSupabaseServerClient();
  const { data, error } = await client.from("profiles").select("*");
  if (error) {
    throw new Error(`Could not read profiles: ${error.message}`);
  }

  return (data ?? []).map((row) => mapProfileToUser(row));
}

export async function writeUsers(users: UserRecord[]) {
  const client = requireSupabaseServerClient();
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
    throw new Error(`Could not write profiles: ${error.message}`);
  }

  return users;
}

export async function readWorkers() {
  const client = requireSupabaseServerClient();
  const { data, error } = await client.from("workers").select("*").order("created_at", { ascending: false });
  if (error) {
    throw new Error(`Could not read workers: ${error.message}`);
  }

  return (data ?? []).map((row) => mapWorkerToRecord(row));
}

export async function writeWorkers(workers: WorkerRecord[]) {
  const client = requireSupabaseServerClient();
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
    throw new Error(`Could not write workers: ${error.message}`);
  }

  return workers;
}

export async function createWorker(worker: Omit<WorkerRecord, "id">) {
  const client = requireSupabaseServerClient();
  const { data, error } = await client
    .from("workers")
    .insert({
      name: worker.name,
      role: worker.role,
      status: worker.status,
      shift: worker.shift,
      department: worker.department,
      created_at: worker.createdAt,
      avatar_url: worker.avatarUrl ?? null,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(`Could not create worker: ${error?.message ?? "No worker returned"}`);
  }

  return mapWorkerToRecord(data);
}

export async function readUploads() {
  const client = requireSupabaseServerClient();

  const { data, error } = await client.from("attachments").select("*");
  if (error) {
    throw new Error(`Could not read uploads: ${error.message}`);
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
  const client = requireSupabaseServerClient();

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
    throw new Error(`Could not write uploads: ${error.message}`);
  }

  return uploads;
}
