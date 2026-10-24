import bcrypt from "bcryptjs";

import { sequelize, User } from "../models/index.js";

const fullName = process.env.ADMIN_NAME;
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;

if (!fullName || !email || !password || password.length < 12) {
  throw new Error("Set ADMIN_NAME, ADMIN_EMAIL, and an ADMIN_PASSWORD of at least 12 characters.");
}

try {
  await sequelize.authenticate();
  const [user, created] = await User.findOrCreate({
    where: { email },
    defaults: {
      fullName,
      email,
      passwordHash: await bcrypt.hash(password, 12),
      role: "admin",
    },
  });

  if (!created) {
    throw new Error(`An account with ${email} already exists; no role was changed.`);
  }

  console.info(`Created administrator account: ${user.email}`);
} catch (error) {
  console.error("Could not create the administrator account.", error);
  process.exitCode = 1;
} finally {
  await sequelize.close();
}
