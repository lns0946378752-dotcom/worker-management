import type { ReactNode } from "react";

import { useAppStore } from "@/store/useAppStore";

export function RoleGate({ allow, children, fallback = null }: { allow: Array<"admin" | "manager" | "staff">; children: ReactNode; fallback?: ReactNode }) {
  const currentUser = useAppStore((state) => state.currentUser);

  if (!currentUser || !allow.includes(currentUser.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
