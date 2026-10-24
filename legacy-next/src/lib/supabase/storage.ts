import { getSupabaseServerClient } from "@/lib/supabase/server";

export type UploadStorageResult = {
  path: string;
  publicUrl: string;
};

export async function uploadAvatarToSupabase({
  file,
  userId,
}: {
  file: File;
  userId: string;
}) {
  const client = getSupabaseServerClient();
  if (!client) {
    throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }

  const safeFileName = file.name.replace(/[^a-zA-Z0-9_.-]/g, "-");
  const storagePath = `avatars/${userId}/${Date.now()}-${safeFileName}`;

  const { data, error } = await client.storage.from("avatars").upload(storagePath, file, {
    cacheControl: "3600",
    upsert: true,
    contentType: file.type || "application/octet-stream",
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data: publicUrlData } = client.storage.from("avatars").getPublicUrl(data?.path ?? storagePath);

  return {
    path: data?.path ?? storagePath,
    publicUrl: publicUrlData.publicUrl,
  } satisfies UploadStorageResult;
}

export async function deleteAvatarFromSupabase(path: string) {
  const client = getSupabaseServerClient();
  if (!client) {
    return false;
  }

  const { error } = await client.storage.from("avatars").remove([path]);
  if (error) {
    console.error("Avatar delete error:", error.message);
    return false;
  }

  return true;
}
