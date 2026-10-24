import { existsSync } from "node:fs";
import { resolve } from "node:path";

import dotenv from "dotenv";

const packageEnvFile = resolve(process.cwd(), ".env");
const workspaceEnvFile = resolve(process.cwd(), "..", ".env");

dotenv.config({
  path: existsSync(packageEnvFile) ? packageEnvFile : workspaceEnvFile,
});
