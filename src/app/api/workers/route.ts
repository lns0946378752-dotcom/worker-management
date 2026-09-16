import { NextResponse } from "next/server";

import { readWorkers, writeWorkers } from "@/lib/server-store";
import { getSessionUser } from "@/lib/session";

export async function GET() {
  const workers = await readWorkers();
  return NextResponse.json({ workers });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!["admin", "manager"].includes(user.role)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as {
    name?: string;
    role?: string;
    status?: "active" | "idle" | "on-leave";
    shift?: string;
    department?: string;
  };

  if (!body.name || !body.role || !body.shift || !body.department) {
    return NextResponse.json({ message: "Missing worker fields." }, { status: 400 });
  }

  const workers = await readWorkers();
  const newWorker = {
    id: `worker-${Date.now()}`,
    name: body.name,
    role: body.role,
    status: body.status ?? "active",
    shift: body.shift,
    department: body.department,
    createdAt: new Date().toISOString(),
  };

  workers.push(newWorker);
  await writeWorkers(workers);

  return NextResponse.json({ worker: newWorker }, { status: 201 });
}
