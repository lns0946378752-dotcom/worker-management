import { NextResponse } from "next/server";

import { getSessionUser } from "@/lib/session";
import { saveUploadFile } from "@/lib/storage";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "File is required." }, { status: 400 });
  }

  const saved = await saveUploadFile(file, user.id);
  return NextResponse.json({ file: saved }, { status: 201 });
}
