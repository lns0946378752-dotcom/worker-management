import { Sequelize } from "sequelize";

import "./env.js";

function requiredEnvironment(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required to connect to the database.`);
  }

  return value;
}

const dialect = process.env.DB_DIALECT ?? "mssql";
const connection = {
  host: requiredEnvironment("DB_SERVER"),
  database: requiredEnvironment("DB_NAME"),
  username: requiredEnvironment("DB_USER"),
  password: requiredEnvironment("DB_PASSWORD"),
  logging: false,
  retry: {
    max: 2,
  },
};

export const sequelize = (() => {
  if (dialect === "postgres") {
    return new Sequelize({
      ...connection,
      dialect: "postgres",
      port: Number(process.env.DB_PORT ?? 5432),
      dialectOptions:
        process.env.DB_SSL === "true"
          ? {
              ssl: {
                require: true,
                rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== "false",
              },
            }
          : undefined,
    });
  }

  if (dialect === "mssql") {
    return new Sequelize({
      ...connection,
      dialect: "mssql",
      port: Number(process.env.DB_PORT ?? 1433),
      dialectOptions: {
        options: {
          encrypt: process.env.DB_ENCRYPT === "true",
          trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === "true",
        },
      },
    });
  }

  throw new Error("DB_DIALECT must be either 'mssql' or 'postgres'.");
})();
