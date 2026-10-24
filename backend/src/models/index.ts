import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";

import { sequelize } from "../config/database.js";

export type UserRole = "admin" | "user";
export type VacancyStatus = "open" | "paused" | "closed";
export type GenderRequirement = "any" | "male" | "female";
export type ApplicationStatus = "submitted" | "reviewing" | "accepted" | "rejected";

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<string>;
  declare fullName: string;
  declare email: string;
  declare passwordHash: string;
  declare role: CreationOptional<UserRole>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export class Company extends Model<InferAttributes<Company>, InferCreationAttributes<Company>> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare address: string | null;
  declare district: string;
  declare contactName: string | null;
  declare contactPhone: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export class Vacancy extends Model<InferAttributes<Vacancy>, InferCreationAttributes<Vacancy>> {
  declare id: CreationOptional<string>;
  declare companyId: ForeignKey<Company["id"]>;
  declare department: string;
  declare title: string;
  declare quantity: number;
  declare status: CreationOptional<VacancyStatus>;
  declare workHours: string;
  declare overtime: CreationOptional<string | null>;
  declare baseSalary: string;
  declare overtimeSalary: CreationOptional<string | null>;
  declare allowances: CreationOptional<string | null>;
  declare minimumAge: CreationOptional<number | null>;
  declare maximumAge: CreationOptional<number | null>;
  declare genderRequirement: CreationOptional<GenderRequirement>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export class Application extends Model<
  InferAttributes<Application>,
  InferCreationAttributes<Application>
> {
  declare id: CreationOptional<string>;
  declare vacancyId: ForeignKey<Vacancy["id"]>;
  declare applicantName: string;
  declare phone: string;
  declare yearOfBirth: number;
  declare gender: Exclude<GenderRequirement, "any">;
  declare status: CreationOptional<ApplicationStatus>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

User.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    fullName: { type: DataTypes.STRING(120), allowNull: false },
    email: { type: DataTypes.STRING(254), allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING(100), allowNull: false },
    role: { type: DataTypes.STRING(10), allowNull: false, defaultValue: "user" },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: "users", underscored: true }
);

Company.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING(160), allowNull: false },
    address: { type: DataTypes.STRING(240), allowNull: true },
    district: { type: DataTypes.STRING(120), allowNull: false },
    contactName: { type: DataTypes.STRING(120), allowNull: true },
    contactPhone: { type: DataTypes.STRING(30), allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: "companies", underscored: true }
);

Vacancy.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    companyId: { type: DataTypes.UUID, allowNull: false },
    department: { type: DataTypes.STRING(120), allowNull: false },
    title: { type: DataTypes.STRING(160), allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.STRING(10), allowNull: false, defaultValue: "open" },
    workHours: { type: DataTypes.STRING(160), allowNull: false },
    overtime: { type: DataTypes.STRING(240), allowNull: true },
    baseSalary: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    overtimeSalary: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
    allowances: { type: DataTypes.STRING(500), allowNull: true },
    minimumAge: { type: DataTypes.TINYINT, allowNull: true },
    maximumAge: { type: DataTypes.TINYINT, allowNull: true },
    genderRequirement: { type: DataTypes.STRING(10), allowNull: false, defaultValue: "any" },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "vacancies",
    underscored: true,
    indexes: [{ fields: ["company_id", "status"] }, { fields: ["department"] }],
  }
);

Application.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    vacancyId: { type: DataTypes.UUID, allowNull: false },
    applicantName: { type: DataTypes.STRING(120), allowNull: false },
    phone: { type: DataTypes.STRING(30), allowNull: false },
    yearOfBirth: { type: DataTypes.SMALLINT, allowNull: false },
    gender: { type: DataTypes.STRING(10), allowNull: false },
    status: { type: DataTypes.STRING(12), allowNull: false, defaultValue: "submitted" },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "applications",
    underscored: true,
    indexes: [{ unique: true, fields: ["vacancy_id", "phone"] }, { fields: ["status", "created_at"] }],
  }
);

Company.hasMany(Vacancy, { foreignKey: "companyId", as: "vacancies" });
Vacancy.belongsTo(Company, { foreignKey: "companyId", as: "company" });
Vacancy.hasMany(Application, { foreignKey: "vacancyId", as: "applications" });
Application.belongsTo(Vacancy, { foreignKey: "vacancyId", as: "vacancy" });

export { sequelize };
