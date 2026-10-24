import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

import { readUsers, writeUsers } from "@/lib/server-store";
import type { UserRecord } from "@/lib/types";
import { hashPassword } from "@/lib/auth";

function isEmailValid(email: string) {
  // simple regex to validate email
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

export async function POST(request: Request) {
  const body = (await request.json()) as { name?: string; email?: string; password?: string };

  const name = String(body.name ?? "").trim();
  const emailRaw = String(body.email ?? "");
  const password = String(body.password ?? "");

  if (!name || !emailRaw || !password) {
    return NextResponse.json({ message: "Name, email and password are required." }, { status: 400 });
  }

  const email = emailRaw.trim().toLowerCase();

  if (!isEmailValid(email)) {
    return NextResponse.json({ message: "Invalid email address." }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ message: "Password must be at least 6 characters." }, { status: 400 });
  }

  const users = await readUsers();

  const exists = users.some((u) => u.email.toLowerCase() === email);
  if (exists) {
    return NextResponse.json({ message: "Email is already registered." }, { status: 409 });
  }

  const newUser: UserRecord = {
    id: randomUUID(),
    name,
    email,
    password: hashPassword(password),
    role: "staff",
    department: "General",
  };

  const updated = [...users, newUser];
  await writeUsers(updated);

  return NextResponse.json({ message: "Account created.", user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, department: newUser.department } }, { status: 201 });
}
