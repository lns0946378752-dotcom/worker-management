"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAppStore } from "@/store/useAppStore";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const currentUser = useAppStore((state) => state.currentUser);
  const login = useAppStore((state) => state.login);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadSession() {
      const response = await fetch("/api/auth/me", { cache: "no-store" });
      if (!response.ok) {
        if (!ignore) {
          login(null, null);
          if (pathname !== "/login") router.replace("/login");
        }
        setIsReady(true);
        return;
      }

      const payload = (await response.json()) as { user?: unknown };
      if (payload.user && !ignore) {
        login(payload.user as Parameters<typeof login>[0]);
      }
      if (!ignore) setIsReady(true);
    }

    void loadSession();

    return () => {
      ignore = true;
    };
  }, [login, pathname, router]);

  if (!isReady) {
    return <div className="auth-loading">Checking session...</div>;
  }

  if (!currentUser && pathname !== "/login") {
    return <div className="auth-loading">Redirecting to login...</div>;
  }

  return <>{children}</>;
}
