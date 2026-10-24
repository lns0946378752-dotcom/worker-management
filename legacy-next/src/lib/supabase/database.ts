import { getSupabaseServerClient } from "@/lib/supabase/server";

import type { UserRole } from "@/store/useAppStore";

export type ProfileRow = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  department: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type WorkerRow = {
  id: string;
  name: string;
  role: string;
  status: "active" | "idle" | "on-leave";
  shift: string;
  department: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type StorageFileRow = {
  id: string;
  user_id: string;
  worker_id: string | null;
  storage_path: string;
  file_name: string;
  content_type: string;
  file_size: number;
  created_at: string;
  updated_at: string;
};

export async function findProfileByEmail(email: string) {
  const client = getSupabaseServerClient();
  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from("profiles")
    .select("*")
    .ilike("email", email)
    .maybeSingle();

  if (error) {
    console.error("Supabase profile lookup error:", error.message);
    return null;
  }

  return data as ProfileRow | null;
}

export async function findProfileById(id: string) {
  const client = getSupabaseServerClient();
  if (!client) {
    return null;
  }

  const { data, error } = await client.from("profiles").select("*").eq("id", id).maybeSingle();

  if (error) {
    console.error("Supabase profile fetch error:", error.message);
    return null;
  }

  return data as ProfileRow | null;
}

export async function listProfiles() {
  const client = getSupabaseServerClient();
  if (!client) {
    return [] as ProfileRow[];
  }

  const { data, error } = await client.from("profiles").select("*").order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase profile list error:", error.message);
    return [] as ProfileRow[];
  }

  return (data ?? []) as ProfileRow[];
}

export async function listWorkers() {
  const client = getSupabaseServerClient();
  if (!client) {
    return [] as WorkerRow[];
  }

  const { data, error } = await client.from("workers").select("*").order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase workers list error:", error.message);
    return [] as WorkerRow[];
  }

  return (data ?? []) as WorkerRow[];
}

export async function createWorker(payload: {
  name: string;
  role: string;
  status: "active" | "idle" | "on-leave";
  shift: string;
  department: string;
}) {
  const client = getSupabaseServerClient();
  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from("workers")
    .insert({
      name: payload.name,
      role: payload.role,
      status: payload.status,
      shift: payload.shift,
      department: payload.department,
    })
    .select()
    .single();

  if (error) {
    console.error("Supabase worker create error:", error.message);
    return null;
  }

  return data as WorkerRow;
}

export async function updateProfileAvatar(userId: string, avatarUrl: string | null) {
  const client = getSupabaseServerClient();
  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from("profiles")
    .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("Supabase profile avatar update error:", error.message);
    return null;
  }

  return data as ProfileRow | null;
}

export async function insertStorageRecord(payload: {
  user_id: string;
  worker_id?: string | null;
  storage_path: string;
  file_name: string;
  content_type: string;
  file_size: number;
}) {
  const client = getSupabaseServerClient();
  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from("attachments")
    .insert({
      user_id: payload.user_id,
      worker_id: payload.worker_id ?? null,
      storage_path: payload.storage_path,
      file_name: payload.file_name,
      content_type: payload.content_type,
      file_size: payload.file_size,
    })
    .select()
    .single();

  if (error) {
    console.error("Supabase storage metadata insert error:", error.message);
    return null;
  }

  return data as StorageFileRow | null;
}
