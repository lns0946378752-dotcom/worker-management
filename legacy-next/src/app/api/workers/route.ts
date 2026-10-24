import { NextResponse } from "next/server";

import { createWorker, readWorkers } from "@/lib/server-store";
import { getSessionUser } from "@/lib/session";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const workers = await readWorkers();
    return NextResponse.json({ workers });
  } catch (error) {
    console.error("GET /api/workers failed:", error);
    return NextResponse.json({ message: "Worker data is unavailable." }, { status: 503 });
  }
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

  const name = body.name?.trim();
  const role = body.role?.trim();
  const shift = body.shift?.trim();
  const department = body.department?.trim();
  const status = body.status ?? "active";

  if (!name || !role || !shift || !department) {
    return NextResponse.json({ message: "Missing worker fields." }, { status: 400 });
  }

  if (!["active", "idle", "on-leave"].includes(status)) {
    return NextResponse.json({ message: "Invalid worker status." }, { status: 400 });
  }

  try {
    const worker = await createWorker({ name, role, status, shift, department, createdAt: new Date().toISOString() });
    return NextResponse.json({ worker }, { status: 201 });
  } catch (error) {
    console.error("POST /api/workers failed:", error);
    return NextResponse.json({ message: "Worker could not be saved." }, { status: 503 });
  }
}
