"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { useAppStore } from "@/store/useAppStore";
import { Modal } from "@/components/ui";
import { useT } from "@/lib/i18n";

export default function ProfileMenu() {
  const router = useRouter();
  const logout = useAppStore((s) => s.logout);
  const currentUser = useAppStore((s) => s.currentUser);
  const [open, setOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const t = useT();

  if (!currentUser) return null;

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    logout();
    router.push("/login");
  };

  return (
    <div style={{ marginTop: "auto" }}>
      <div className="profile-card" onClick={() => setOpen((v) => !v)} style={{ cursor: "pointer" }}>
        <div className="avatar">{currentUser?.name?.charAt(0) ?? "U"}</div>
        <div>
          <strong>{currentUser?.name ?? ""}</strong>
          <small>{currentUser?.role ?? ""}</small>
        </div>
      </div>

      {open ? (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: 8, marginTop: 8 }}>
          <button className="nav__item" onClick={() => { setShowProfile(true); setOpen(false); }} style={{ width: "100%", textAlign: "left" }}>{t("profile") ?? "Profile"}</button>
          <button className="nav__item" onClick={() => { router.push('/settings'); setOpen(false); }} style={{ width: "100%", textAlign: "left" }}>{t("settings") ?? "Settings"}</button>
          <div style={{ height: 1, background: "var(--border)", margin: "8px 0" }} />
          <button className="nav__item" onClick={handleLogout} style={{ width: "100%", textAlign: "left" }}>{t("logout") ?? "Logout"}</button>
        </div>
      ) : null}

      <Modal isOpen={showProfile} title={t("profile") ?? "Profile"} onClose={() => setShowProfile(false)}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div className="ui-avatar ui-avatar--lg">{currentUser?.name?.charAt(0) ?? "U"}</div>
          <div>
            <div style={{ fontWeight: 700 }}>{currentUser?.name ?? ""}</div>
            <div style={{ color: "var(--muted)" }}>{currentUser?.email ?? ""}</div>
            <div style={{ marginTop: 8 }}>
              <div><strong>{t("role") ?? "Role"}:</strong> {currentUser?.role ?? ""}</div>
              <div><strong>{t("department") ?? "Department"}:</strong> {currentUser?.department ?? ""}</div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
