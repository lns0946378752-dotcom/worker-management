"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { RequireAuth } from "@/components/auth/RequireAuth";
import { RoleGate } from "@/components/auth/RoleGate";
import { Button, Card, Input, Modal, Table } from "@/components/ui";
import { useAppStore } from "@/store/useAppStore";
import { useT } from "@/lib/i18n";
import type { WorkerRecord } from "@/lib/types";

type Worker = WorkerRecord;

export default function WorkersPage() {
  const router = useRouter();
  const handleBack = () => {
    router.push("/");
  };
  const currentUser = useAppStore((state) => state.currentUser);
  const t = useT();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    role: "",
    shift: "",
    department: "",
    status: "active" as Worker["status"],
  });

  const loadWorkers = async () => {
    setLoading(true);
    const response = await fetch("/api/workers");
    const payload = (await response.json()) as { workers?: Worker[] };
    const list = payload.workers ?? [];
    // sort newest first by createdAt if available
    list.sort((a, b) => {
      const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return tb - ta;
    });
    setWorkers(list);
    setLoading(false);
  };

  useEffect(() => {
    void loadWorkers();
  }, []);

  const filteredWorkers = workers.filter((worker) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return [worker.name, worker.role, worker.department, worker.shift].some((value) =>
      value.toLowerCase().includes(query)
    );
  });
  // ensure sorted newest first for display
  filteredWorkers.sort((a, b) => {
    const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return tb - ta;
  });

  const handleCreate = async () => {
    const response = await fetch("/api/workers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      setForm({ name: "", role: "", shift: "", department: "", status: "active" });
      setIsOpen(false);
      void loadWorkers();
    }
  };

  return (
    <RequireAuth>
    <main className="page-wrap">
      <div style={{ marginBottom: 12 }}>
        <Button variant="secondary" size="sm" onClick={handleBack}>
          ← Back
        </Button>
      </div>
      <Card title={t("workerOverview") ?? "Worker directory"} subtitle={`${t("teamMonitoring") ?? "Team monitoring"} - ${`Signed in as ${currentUser?.role ?? "guest"}`}`} className="full-span">
        <div className="toolbar">
          <Input
            placeholder={t("searchEmployees")}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search workers"
          />
          <RoleGate allow={["admin", "manager"]}>
            <Button onClick={() => setIsOpen(true)}>{t("addWorker")}</Button>
          </RoleGate>
        </div>

        {loading ? <p className="state-message">Loading workers...</p> : (
          <Table
            columns={[
              { key: "name", label: "Name" },
              { key: "role", label: "Role" },
              { key: "department", label: "Department" },
              { key: "shift", label: "Shift" },
              {
                key: "status",
                label: "Status",
                render: (row) => (
                  <span className={`status-chip status-chip--${row.status}`}>
                    {row.status}
                  </span>
                ),
              },
            ]}
            rows={filteredWorkers}
            emptyMessage={t("noWorkersYet")}
          />
        )}
      </Card>

      <Modal isOpen={isOpen} title={t("addWorker") ?? "Add worker"} onClose={() => setIsOpen(false)}>
        <div className="modal-form">
          <Input label={t("fullName") ?? "Name"} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <Input label={t("workers") ?? "Role"} value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} />
          <Input label="Department" value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })} />
          <Input label="Shift" value={form.shift} onChange={(event) => setForm({ ...form, shift: event.target.value })} />
          <label className="field-label">
            <span>Status</span>
            <select
              value={form.status}
              onChange={(event) => setForm({ ...form, status: event.target.value as Worker["status"] })}
            >
              <option value="active">Active</option>
              <option value="idle">Idle</option>
              <option value="on-leave">On leave</option>
            </select>
          </label>
          <Button onClick={handleCreate} fullWidth>
            Save worker
          </Button>
        </div>
      </Modal>
    </main>
    </RequireAuth>
  );
}
