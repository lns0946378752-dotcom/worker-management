import type { AccessState } from "../services/access-policy.js";

declare global {
  namespace Express {
    interface Request {
      auth?: AccessState;
      validatedQuery?: Record<string, unknown>;
    }
  }
}

export {};
