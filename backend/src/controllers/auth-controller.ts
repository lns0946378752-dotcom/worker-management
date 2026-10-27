import type { Request, Response } from "express";

import { loginUser, registerUser } from "../services/auth-service.js";

export async function register(request: Request, response: Response) {
  const result = await registerUser(request.body);
  response.status(201).json(result);
}

export async function login(request: Request, response: Response) {
  const result = await loginUser(request.body);
  response.json(result);
}

export async function currentUser(request: Request, response: Response) {
  const { id, fullName, email, role, status } = request.auth!;
  response.json({ user: { id, fullName, email, role, status } });
}
