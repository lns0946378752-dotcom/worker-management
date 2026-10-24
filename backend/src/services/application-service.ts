import { Op } from "sequelize";

import { Application, Company, Vacancy } from "../models/index.js";
import { HttpError } from "../utils/http-error.js";
import { getPagination, getPaginationResponse } from "../utils/pagination.js";

export async function createApplication(input: {
  vacancyId: string;
  applicantName: string;
  phone: string;
  yearOfBirth: number;
  gender: "male" | "female";
}) {
  const vacancy = await Vacancy.findByPk(input.vacancyId);
  if (!vacancy || vacancy.status !== "open") {
    throw new HttpError(404, "This vacancy is not accepting applications.");
  }

  if (vacancy.genderRequirement !== "any" && vacancy.genderRequirement !== input.gender) {
    throw new HttpError(400, "Applicant does not meet the vacancy gender requirement.");
  }

  const age = new Date().getFullYear() - input.yearOfBirth;
  if (
    (vacancy.minimumAge !== null && age < vacancy.minimumAge) ||
    (vacancy.maximumAge !== null && age > vacancy.maximumAge)
  ) {
    throw new HttpError(400, "Applicant does not meet the vacancy age requirement.");
  }

  const existingApplication = await Application.findOne({
    where: { vacancyId: input.vacancyId, phone: input.phone },
  });
  if (existingApplication) {
    throw new HttpError(409, "This phone number has already applied for the vacancy.");
  }

  return Application.create({ ...input, status: "submitted" });
}

export async function listApplications(query: Record<string, unknown>) {
  const pagination = getPagination(query.page, query.pageSize);
  const search = typeof query.search === "string" ? query.search : undefined;
  const where = {
    ...(typeof query.applicationStatus === "string" ? { status: query.applicationStatus } : {}),
    ...(search
      ? {
          [Op.or]: [
            { applicantName: { [Op.like]: `%${search}%` } },
            { phone: { [Op.like]: `%${search}%` } },
          ],
        }
      : {}),
  };

  const { rows, count } = await Application.findAndCountAll({
    where,
    include: [
      {
        model: Vacancy,
        as: "vacancy",
        attributes: ["id", "title", "department", "companyId"],
        include: [{ model: Company, as: "company", attributes: ["id", "name"] }],
      },
    ],
    limit: pagination.limit,
    offset: pagination.offset,
    order: [["createdAt", "DESC"]],
  });

  return { items: rows, pagination: getPaginationResponse(count, pagination) };
}

export async function updateApplicationStatus(
  id: string,
  status: "submitted" | "reviewing" | "accepted" | "rejected"
) {
  const application = await Application.findByPk(id);
  if (!application) {
    throw new HttpError(404, "Application was not found.");
  }

  await application.update({ status });
  return application;
}
