import { loadAccessState } from "../services/access-repository.js";
import { createAuthenticate, requireRole } from "./auth-core.js";

export { requireRole };
export const authenticate = createAuthenticate(loadAccessState);
