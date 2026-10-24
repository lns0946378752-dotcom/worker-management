import { NextResponse } from "next/server";

import { verifyUserToken } from "@/lib/auth";
import { readUsers } from "@/lib/server-store";

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const match = cookieHeader.match(/(?:^|; )wm_token=([^;]+)/);
  const token = match ? decodeURIComponent(match[1]) : "";

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const payload = verifyUserToken(token);
  if (!payload) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const users = await readUsers();
  const user = users.find((record) => record.id === payload.sub || record.email === payload.email);

  if (!user) {
    return NextResponse.json({ user: null }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      avatarUrl: user.avatarUrl,
    },
  });
}
