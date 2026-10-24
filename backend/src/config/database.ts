import { Sequelize } from "sequelize";

import "./env.js";

function requiredEnvironment(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required to connect to SQL Server.`);
  }

  return value;
}

export const sequelize = new Sequelize({
  dialect: "mssql",
  host: requiredEnvironment("DB_SERVER"),
  port: Number(process.env.DB_PORT ?? 1433),
  database: requiredEnvironment("DB_NAME"),
  username: requiredEnvironment("DB_USER"),
  password: requiredEnvironment("DB_PASSWORD"),
  dialectOptions: {
    options: {
      encrypt: process.env.DB_ENCRYPT === "true",
      trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === "true",
    },
  },
  logging: false,
  retry: {
    max: 2,
  },
});
