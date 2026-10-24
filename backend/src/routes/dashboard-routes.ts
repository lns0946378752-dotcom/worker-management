import { Router } from "express";

import { summary } from "../controllers/dashboard-controller.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = Router();

/**
 * @openapi
 * /dashboard:
 *   get:
 *     summary: Get recruitment summary metrics for administrators
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Recruitment totals grouped by status }
 *       401: { description: Authentication is required }
 *       403: { description: Administrator role is required }
 */
router.get("/", authenticate, requireRole("admin"), summary);

export default router;
