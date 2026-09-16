"use client";

import { useAppStore } from "@/store/useAppStore";
import { Button, Card, Input } from "@/components/ui";
import { useT } from "@/lib/i18n";
import { RequireAuth } from "@/components/auth/RequireAuth";

export default function SettingsPage() {
  const t = useT();
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const currentUser = useAppStore((s) => s.currentUser);

  return (
    <RequireAuth>
    <main className="page-wrap">
      <Card title={t("settings") ?? "Settings"} className="full-span">
        <div style={{ display: 'grid', gap: 18 }}>
          <section>
            <h3>Appearance</h3>
            <label className="field-label">
              <span>Theme</span>
              <select value={theme} onChange={(e) => setTheme(e.target.value as any)}>
                <option value="default">Default</option>
                <option value="green">Green</option>
                <option value="purple">Purple</option>
              </select>
            </label>
          </section>

          <section>
            <h3>Language</h3>
            <label className="field-label">
              <span>Language</span>
              <select value={language} onChange={(e) => setLanguage(e.target.value as any)}>
                <option value="en">English</option>
                <option value="vi">Tiếng Việt</option>
              </select>
            </label>
          </section>

          <section>
            <h3>Account</h3>
            <label className="field-label"><span>Email</span><Input value={currentUser?.email ?? ""} readOnly /></label>
            <label className="field-label"><span>Role</span><Input value={currentUser?.role ?? ""} readOnly /></label>
            <label className="field-label"><span>Department</span><Input value={currentUser?.department ?? ""} readOnly /></label>
          </section>
        </div>
      </Card>
    </main>
    </RequireAuth>
  );
}
