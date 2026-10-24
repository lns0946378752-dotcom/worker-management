import { sequelize } from "./models/index.js";
import app from "./app.js";
import { assertJwtConfiguration } from "./utils/access-token.js";

const port = Number(process.env.PORT ?? 4000);

try {
  assertJwtConfiguration();
  await sequelize.authenticate();
  app.listen(port, () => {
    console.info(`Worker Management API listening on http://localhost:${port}`);
    console.info(`Swagger UI available at http://localhost:${port}/api-docs`);
  });
} catch (error) {
  console.error("Could not start the API. Check the database and the DB_* environment settings.", error);
  process.exitCode = 1;
}
