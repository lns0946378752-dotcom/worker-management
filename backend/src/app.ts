import cors from "cors";
import express from "express";
import helmet from "helmet";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { rateLimit } from "express-rate-limit";

import { errorHandler } from "./middleware/error-handler.js";
import { authenticate } from "./middleware/auth.js";
import { HttpError } from "./utils/http-error.js";
import { adminService } from "./services/admin-service.js";
import { workerService } from "./services/worker-service.js";
import { createAdminRouter } from "./routes/admin-routes.js";
import { createWorkerRouter } from "./routes/worker-routes.js";
import authRoutes from "./routes/auth-routes.js";
import companyRoutes from "./routes/company-routes.js";

const app = express();
const allowedOrigins = (process.env.CLIENT_ORIGIN ?? "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.disable("x-powered-by");
app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new HttpError(403, "Trang web chưa được cấp quyền kết nối tới máy chủ."));
    },
  })
);
app.use(express.json({ limit: "32kb" }));
app.use(
  "/api",
  rateLimit({
    windowMs: 60 * 1000,
    limit: 120,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { message: "Bạn thao tác quá nhanh. Vui lòng chờ một lúc rồi thử lại." },
  })
);

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Worker Management API",
      version: "1.0.0",
      description: "Workforce-management API: accounts, permissions and worker profiles.",
    },
    servers: [{ url: "/api" }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
  },
  apis: ["src/routes/*.ts", "dist/routes/*.js"],
});

app.get("/health", (_request, response) => response.json({ status: "ok" }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/auth", authRoutes);
app.use("/api/admin", createAdminRouter({ authenticate, service: adminService }));
app.use("/api/workers", createWorkerRouter({ authenticate, service: workerService }));
app.use("/api/companies", companyRoutes);

app.use((_request, response) => response.status(404).json({ message: "Không tìm thấy đường dẫn yêu cầu." }));
app.use(errorHandler);

export default app;
