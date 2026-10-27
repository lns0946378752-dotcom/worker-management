import { Op } from "sequelize";

import { Company } from "../models/index.js";
import { HttpError } from "../utils/http-error.js";
import { getOrder, getPagination, getPaginationResponse } from "../utils/pagination.js";
import type { CompanyInput } from "../validators/schemas.js";
import { select } from "./access-repository.js";

export async function listCompanies(query: Record<string, unknown>) {
  const pagination = getPagination(query.page, query.pageSize);
  const search = typeof query.search === "string" ? query.search : undefined;
  const district = typeof query.district === "string" ? query.district : undefined;
  const where = {
    ...(district ? { district: { [Op.like]: `%${district}%` } } : {}),
    ...(search
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { district: { [Op.like]: `%${search}%` } },
            { contactName: { [Op.like]: `%${search}%` } },
          ],
        }
      : {}),
  };

  const { rows, count } = await Company.findAndCountAll({
    where,
    limit: pagination.limit,
    offset: pagination.offset,
    order: getOrder(query.sort, ["name", "district", "createdAt"], "name"),
  });

  return { items: rows, pagination: getPaginationResponse(count, pagination) };
}

export async function createCompany(input: CompanyInput) {
  return Company.create({
    name: input.name,
    address: input.address ?? null,
    district: input.district,
    contactName: input.contactName ?? null,
    contactPhone: input.contactPhone ?? null,
  });
}

export async function updateCompany(id: string, input: CompanyInput) {
  const company = await Company.findByPk(id);
  if (!company) {
    throw new HttpError(404, "Không tìm thấy công ty.");
  }

  await company.update({
    ...input,
    address: input.address ?? null,
    contactName: input.contactName ?? null,
    contactPhone: input.contactPhone ?? null,
  });
  return company;
}

export async function deleteCompany(id: string) {
  const company = await Company.findByPk(id);
  if (!company) {
    throw new HttpError(404, "Không tìm thấy công ty.");
  }

  // Worker profiles (including soft-deleted ones) and legacy vacancy rows keep a foreign key to the company.
  const [usage] = await select(
    `DECLARE @n INT = 0;
     IF OBJECT_ID(N'dbo.worker_profiles', N'U') IS NOT NULL SELECT @n = @n + COUNT(*) FROM dbo.worker_profiles WHERE company_id = :id;
     IF OBJECT_ID(N'dbo.vacancies', N'U') IS NOT NULL SELECT @n = @n + COUNT(*) FROM dbo.vacancies WHERE company_id = :id;
     SELECT @n AS total;`,
    { id }
  );
  if (Number(usage?.total) > 0) {
    throw new HttpError(409, "Không thể xóa công ty đang gắn với hồ sơ công nhân hoặc dữ liệu cũ.");
  }

  await company.destroy();
}
