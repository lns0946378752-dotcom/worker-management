import { createPendingAccount, emailExists, findLoginRecord } from "./access-repository.js";
import { createAuthService } from "./auth-core.js";

export const { registerUser, loginUser } = createAuthService({ findLoginRecord, emailExists, createPendingAccount });
