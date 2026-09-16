import { create } from "zustand";

export type UserRole = "admin" | "manager" | "staff";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatarUrl?: string;
};

type AppState = {
  currentUser: CurrentUser | null;
  token: string | null;
  selectedView: "overview" | "workers" | "reports";
  filterStatus: "all" | "active" | "idle" | "on-leave";
  theme: "default" | "green" | "purple";
  setTheme: (theme: AppState["theme"]) => void;
  language: "en" | "vi";
  setLanguage: (lang: AppState["language"]) => void;
  login: (user: CurrentUser | null, token?: string | null) => void;
  logout: () => void;
  setSelectedView: (view: AppState["selectedView"]) => void;
  setFilterStatus: (status: AppState["filterStatus"]) => void;
};

export const useAppStore = create<AppState>((set) => ({
  currentUser: null,
  token: null,
  selectedView: "overview",
  filterStatus: "all",
  theme: (typeof window !== "undefined" && (localStorage.getItem("wm_theme") as any)) ?? "default",
  setTheme: (theme) => {
    try { localStorage.setItem("wm_theme", theme); } catch {}
    set({ theme });
  },
  language: (typeof window !== "undefined" && (localStorage.getItem("wm_lang") as any)) ?? "en",
  setLanguage: (lang) => {
    try { localStorage.setItem("wm_lang", lang); } catch {}
    set({ language: lang });
  },
  login: (user, token = null) => set({ currentUser: user, token }),
  logout: () => set({ currentUser: null, token: null }),
  setSelectedView: (view) => set({ selectedView: view }),
  setFilterStatus: (status) => set({ filterStatus: status }),
}));
