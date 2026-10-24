import { Op } from "sequelize";

import { Company, Vacancy } from "../models/index.js";
import { HttpError } from "../utils/http-error.js";
import { getOrder, getPagination, getPaginationResponse } from "../utils/pagination.js";
import type { CompanyInput } from "../validators/schemas.js";

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

  if (await Vacancy.count({ where: { companyId: id } })) {
    throw new HttpError(409, "Hãy xóa hoặc chuyển các vị trí tuyển dụng trước khi xóa công ty.");
  }

  await company.destroy();
}
