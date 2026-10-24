import { Router } from "express";

import { create, list, remove, update } from "../controllers/vacancy-controller.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import { validateBody, validateQuery } from "../middleware/validate.js";
import { listQuerySchema, vacancySchema } from "../validators/schemas.js";

const router = Router();

/**
 * @openapi
 * /vacancies:
 *   get:
 *     summary: Filter and paginate job vacancies
 *     tags: [Vacancies]
 *     parameters:
 *       - { in: query, name: search, schema: { type: string } }
 *       - { in: query, name: district, schema: { type: string } }
 *       - { in: query, name: companyId, schema: { type: string, format: uuid } }
 *       - { in: query, name: department, schema: { type: string } }
 *       - { in: query, name: status, schema: { type: string, enum: [open, paused, closed] } }
 *       - { in: query, name: page, schema: { type: integer, minimum: 1 } }
 *       - { in: query, name: pageSize, schema: { type: integer, minimum: 1, maximum: 100 } }
 *     responses:
 *       200: { description: A filtered, paginated vacancy list }
 */
router.get("/", validateQuery(listQuerySchema), list);
router.post("/", authenticate, requireRole("admin"), validateBody(vacancySchema), create);
router.put("/:id", authenticate, requireRole("admin"), validateBody(vacancySchema), update);
router.delete("/:id", authenticate, requireRole("admin"), remove);

export default router;
