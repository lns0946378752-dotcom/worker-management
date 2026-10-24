import bcrypt from "bcryptjs";

import { User } from "../models/index.js";
import { HttpError } from "../utils/http-error.js";
import { signAccessToken } from "../utils/access-token.js";

type PublicUser = {
  id: string;
  fullName: string;
  email: string;
  role: User["role"];
};

type AuthenticationResult = {
  user: PublicUser;
  token: string;
};

function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  };
}

export async function registerUser(input: {
  fullName: string;
  email: string;
  password: string;
}): Promise<AuthenticationResult> {
  const email = input.email.toLowerCase();
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new HttpError(409, "An account with this email already exists.");
  }

  const user = await User.create({
    fullName: input.fullName,
    email,
    passwordHash: await bcrypt.hash(input.password, 12),
    role: "user",
  });

  return { user: toPublicUser(user), token: signAccessToken(user) };
}

export async function loginUser(input: { email: string; password: string }): Promise<AuthenticationResult> {
  const user = await User.findOne({ where: { email: input.email.toLowerCase() } });
  if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
    throw new HttpError(401, "Email or password is incorrect.");
  }

  return { user: toPublicUser(user), token: signAccessToken(user) };
}

export async function getCurrentUser(id: string): Promise<PublicUser> {
  const user = await User.findByPk(id, { attributes: ["id", "fullName", "email", "role"] });
  if (!user) {
    throw new HttpError(404, "Account was not found.");
  }

  return toPublicUser(user);
}
