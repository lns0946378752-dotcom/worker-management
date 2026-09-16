import { NextResponse } from "next/server";

import { getUploadFileByKey } from "@/lib/storage";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ storageKey: string }> }
) {
  const { storageKey } = await params;
  const decoded = decodeURIComponent(storageKey);
  const buffer = await getUploadFileByKey(decoded);

  if (!buffer) {
    return NextResponse.json({ message: "File not found." }, { status: 404 });
  }

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Cache-Control": "private, max-age=3600",
    },
  });
}
