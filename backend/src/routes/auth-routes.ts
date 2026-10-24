import { Router } from "express";
import { rateLimit } from "express-rate-limit";

import { currentUser, login, register } from "../controllers/auth-controller.js";
import { authenticate } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { loginSchema, registerSchema } from "../validators/schemas.js";

const router = Router();
const loginLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a standard user account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, email, password]
 *             properties:
 *               fullName: { type: string, example: Nguyen Van An }
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 8 }
 *     responses:
 *       201: { description: Account created }
 *       400: { description: Invalid input }
 *       409: { description: Email already exists }
 */
router.post("/register", validateBody(registerSchema), register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Sign in and receive a JWT access token
 *     tags: [Authentication]
 *     responses:
 *       200: { description: Access token and public user profile }
 *       401: { description: Invalid credentials }
 */
router.post("/login", loginLimit, validateBody(loginSchema), login);
router.get("/me", authenticate, currentUser);

export default router;
