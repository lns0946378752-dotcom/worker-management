"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { RequireAuth } from "@/components/auth/RequireAuth";
import { Badge, Button, Card, Input } from "@/components/ui";
import { useAppStore } from "@/store/useAppStore";
import { useT } from "@/lib/i18n";
import ProfileMenu from "@/components/ProfileMenu";

const stats = [
  { label: "Total workers", value: "1,284", change: "+12.4%", tone: "primary" },
  { label: "Active today", value: "876", change: "+8.1%", tone: "success" },
  { label: "On leave", value: "43", change: "-2.2%", tone: "warning" },
  { label: "Open tasks", value: "128", change: "+4.7%", tone: "danger" },
];

const workers = [
  { name: "Nguyễn Văn A", role: "Machine operator", status: "active", shift: "A-Shift" },
  { name: "Trần Thị B", role: "QC Inspector", status: "idle", shift: "B-Shift" },
  { name: "Lê Văn C", role: "Warehouse", status: "on-leave", shift: "A-Shift" },
  { name: "Phạm Thị D", role: "Team Lead", status: "active", shift: "C-Shift" },
];

const statusColor: Record<string, "neutral" | "success" | "warning" | "danger"> = {
  active: "success",
  idle: "warning",
  "on-leave": "danger",
};

export default function HomePage() {
  const router = useRouter();
  const { currentUser, selectedView, setSelectedView, filterStatus, setFilterStatus, logout } =
    useAppStore();
  const t = useT();
  const [workersList, setWorkersList] = useState<any[]>([]);
  const [workersLoading, setWorkersLoading] = useState(true);

  useEffect(() => {
    if (selectedView === "workers") {
      router.push("/workers");
    }
  }, [router, selectedView]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setWorkersLoading(true);
      try {
        const res = await fetch('/api/workers');
        const payload = await res.json();
        const list = payload.workers ?? [];
        list.sort((a: any,b: any)=>{
          const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return tb - ta;
        });
        if (mounted) setWorkersList(list);
      } catch (e) {
        if (mounted) setWorkersList([]);
      } finally {
        if (mounted) setWorkersLoading(false);
      }
    };
    void load();
    return () => { mounted = false; };
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    logout();
    router.push("/login");
  };
  // theme and language selectors moved to /settings

  return (
    <RequireAuth>
      <main className="app-shell">
      <aside className="sidebar">
        <div className="brand" role="button" onClick={() => router.push('/')} style={{cursor: 'pointer'}}>
          <div className="brand__mark">WM</div>
          <div>
            <strong>WorkerManagement</strong>
            <small>Operations suite</small>
          </div>
        </div>

        <nav className="nav" aria-label="Sidebar navigation">
          {[
            ["overview", t("overview")],
            ["workers", t("workers")],
            ["reports", t("reports")],
          ].map(([value, label]) => (
            <button
              key={value}
              className={selectedView === value ? "nav__item nav__item--active" : "nav__item"}
              onClick={() => setSelectedView(value as typeof selectedView)}
            >
              {label}
            </button>
          ))}
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <ProfileMenu />
        </div>
      </aside>

      <section className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">{t("workforceDashboard")}</p>
            <h1>{t("welcomeBack")} {currentUser?.name?.split(" ").slice(-1)[0] ?? "there"}</h1>
          </div>
          <div className="topbar__actions">
            <Button variant="secondary">{t("export")}</Button>
            <Button variant="ghost" onClick={handleLogout}>Logout</Button>
          </div>
        </header>

        <div className="stats-grid">
          <Card className="stat-card">
            <p className="stat-label">{t("totalWorkers")}</p>
            <div className="stat-value-row">
              <strong>{workersList.length}</strong>
            </div>
          </Card>

          <Card className="stat-card">
            <p className="stat-label">{t("activeToday")}</p>
            <div className="stat-value-row">
              <strong>{workersList.filter((w)=>w.status=== 'active').length}</strong>
            </div>
          </Card>

          <Card className="stat-card">
            <p className="stat-label">{t("onLeave")}</p>
            <div className="stat-value-row">
              <strong>{workersList.filter((w)=>w.status=== 'on-leave').length}</strong>
            </div>
          </Card>

          <Card className="stat-card">
            <p className="stat-label">{t("openTasks")}</p>
            <div className="stat-value-row">
              <strong>{0}</strong>
            </div>
          </Card>
        </div>

        <div className="panel-grid">
          <Card title="Worker overview" subtitle="Team monitoring" className="panel-card">
            <div className="toolbar">
              <div className="toolbar__filters">
                {(["all", "active", "idle", "on-leave"] as const).map((status) => (
                  <button
                    key={status}
                    className={filterStatus === status ? "chip chip--active" : "chip"}
                    onClick={() => setFilterStatus(status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
              <Input placeholder="Search employees" aria-label="Search employees" />
            </div>

            <div className="table">
              <div className="table__head">
                <span>Name</span>
                <span>Role</span>
                <span>Status</span>
                <span>Shift</span>
              </div>

              {workersList.length === 0 && !workersLoading ? (
                <div className="state-message">No workers yet.</div>
              ) : (
                workersList.map((worker) => (
                  <div key={worker.id} className="table__row">
                    <span>{worker.name}</span>
                    <span>{worker.role}</span>
                    <span>
                      <Badge variant={statusColor[worker.status]}>{worker.status}</Badge>
                    </span>
                    <span>{worker.shift}</span>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card title="Quick actions" subtitle="Operational controls" className="panel-card compact">
            <div className="action-stack">
              <Button variant="secondary" fullWidth>
                Review attendance
              </Button>
              <Button variant="secondary" fullWidth>
                Assign shift
              </Button>
              <Button variant="secondary" fullWidth>
                Manage payroll
              </Button>
            </div>
          </Card>
        </div>
      </section>
      </main>
    </RequireAuth>
  );
}
