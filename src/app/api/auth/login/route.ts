import { NextResponse } from "next/server";

import { signUserToken, verifyPassword } from "@/lib/auth";
import { readUsers } from "@/lib/server-store";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };

  if (!body.email || !body.password) {
    return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
  }

  const email = body.email.trim();
  const password = body.password;

  const users = await readUsers();
  const user = users.find((record) => record.email.toLowerCase() === email.toLowerCase());

  if (!user || !verifyPassword(password, user.password)) {
    return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
  }

  const token = signUserToken(user);

  const response = NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      avatarUrl: user.avatarUrl,
    },
    token,
  });

  response.cookies.set("wm_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
