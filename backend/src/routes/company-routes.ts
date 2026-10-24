import { Router } from "express";

import { create, list, remove, update } from "../controllers/company-controller.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import { validateBody, validateQuery } from "../middleware/validate.js";
import { companySchema, listQuerySchema } from "../validators/schemas.js";

const router = Router();

/**
 * @openapi
 * /companies:
 *   get:
 *     summary: Search and paginate companies
 *     tags: [Companies]
 *     parameters:
 *       - { in: query, name: search, schema: { type: string } }
 *       - { in: query, name: district, schema: { type: string } }
 *       - { in: query, name: page, schema: { type: integer, minimum: 1 } }
 *       - { in: query, name: pageSize, schema: { type: integer, minimum: 1, maximum: 100 } }
 *     responses:
 *       200: { description: A paginated company list }
 */
router.get("/", validateQuery(listQuerySchema), list);
router.post("/", authenticate, requireRole("admin"), validateBody(companySchema), create);
router.put("/:id", authenticate, requireRole("admin"), validateBody(companySchema), update);
router.delete("/:id", authenticate, requireRole("admin"), remove);

export default router;
