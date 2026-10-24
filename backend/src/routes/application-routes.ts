import { Router } from "express";
import { rateLimit } from "express-rate-limit";

import { create, list, updateStatus } from "../controllers/application-controller.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import { validateBody, validateQuery } from "../middleware/validate.js";
import { applicationSchema, applicationStatusSchema, listQuerySchema } from "../validators/schemas.js";

const router = Router();
const applicationLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Bạn đã gửi quá nhiều hồ sơ. Vui lòng thử lại sau một giờ." },
});

/**
 * @openapi
 * /applications:
 *   post:
 *     summary: Apply for an open vacancy
 *     tags: [Applications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [vacancyId, applicantName, phone, yearOfBirth, gender]
 *     responses:
 *       201: { description: Application submitted }
 *       400: { description: Invalid details or eligibility mismatch }
 *       409: { description: Phone number already applied to this vacancy }
 */
router.post("/", applicationLimit, validateBody(applicationSchema), create);
router.get("/", authenticate, requireRole("admin"), validateQuery(listQuerySchema), list);
router.patch(
  "/:id/status",
  authenticate,
  requireRole("admin"),
  validateBody(applicationStatusSchema),
  updateStatus
);

export default router;
