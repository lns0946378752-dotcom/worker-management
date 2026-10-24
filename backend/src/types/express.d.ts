import type { UserRole } from "../models/index.js";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        id: string;
        email: string;
        role: UserRole;
      };
      validatedQuery?: Record<string, unknown>;
    }
  }
}

export {};
