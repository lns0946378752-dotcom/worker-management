import { cookies } from "next/headers";

import { verifyUserToken } from "@/lib/auth";
import { readUsers } from "@/lib/server-store";

export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("wm_token")?.value;

  if (!token) {
    return null;
  }

  const payload = verifyUserToken(token);
  if (!payload) {
    return null;
  }

  const users = await readUsers();
  const user = users.find((item) => item.id === payload.sub || item.email === payload.email);

  return user ?? null;
}
