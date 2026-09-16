export type UserRole = "admin" | "manager" | "staff";

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  department: string;
  avatarUrl?: string;
};

export type WorkerStatus = "active" | "idle" | "on-leave";

export type WorkerRecord = {
  id: string;
  name: string;
  role: string;
  status: WorkerStatus;
  shift: string;
  department: string;
  createdAt?: string;
  avatarUrl?: string;
};

export type UploadRecord = {
  id: string;
  userId: string;
  fileName: string;
  storagePath: string;
  storageKey: string;
  contentType: string;
  size: number;
  createdAt: string;
  url: string;
};
