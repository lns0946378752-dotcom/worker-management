"use client";

import { useRouter } from "next/navigation";
import { Button, Card } from "@/components/ui";
import { RequireAuth } from "@/components/auth/RequireAuth";

export default function ReportsPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/");
  };

  return (
    <RequireAuth>
    <main className="page-wrap">
      <div style={{ marginBottom: 12 }}>
        <Button variant="secondary" size="sm" onClick={handleBack}>
          ← Back
        </Button>
      </div>

      <Card title="Reports" subtitle="Operational reports" className="full-span">
        <p className="state-message">Reports coming soon.</p>
      </Card>
    </main>
    </RequireAuth>
  );
}
