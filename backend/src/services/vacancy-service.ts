import { Op } from "sequelize";

import { Application, Company, Vacancy } from "../models/index.js";
import { HttpError } from "../utils/http-error.js";
import { getOrder, getPagination, getPaginationResponse } from "../utils/pagination.js";
import type { VacancyInput } from "../validators/schemas.js";

export async function listVacancies(query: Record<string, unknown>) {
  const pagination = getPagination(query.page, query.pageSize);
  const search = typeof query.search === "string" ? query.search : undefined;
  const district = typeof query.district === "string" ? query.district : undefined;
  const where = {
    ...(typeof query.companyId === "string" ? { companyId: query.companyId } : {}),
    ...(typeof query.department === "string"
      ? { department: { [Op.like]: `%${query.department}%` } }
      : {}),
    ...(typeof query.status === "string" ? { status: query.status } : {}),
    ...(search
      ? {
          [Op.or]: [
            { title: { [Op.like]: `%${search}%` } },
            { department: { [Op.like]: `%${search}%` } },
          ],
        }
      : {}),
  };

  const include = [
    {
      model: Company,
      as: "company",
      attributes: ["id", "name", "district"],
      ...(district ? { where: { district: { [Op.like]: `%${district}%` } } } : {}),
      required: Boolean(district),
    },
  ];

  const { rows, count } = await Vacancy.findAndCountAll({
    where,
    include,
    distinct: true,
    limit: pagination.limit,
    offset: pagination.offset,
    order: getOrder(query.sort, ["title", "department", "baseSalary", "createdAt"], "createdAt"),
  });

  return { items: rows, pagination: getPaginationResponse(count, pagination) };
}

export async function createVacancy(input: VacancyInput) {
  const company = await Company.findByPk(input.companyId);
  if (!company) {
    throw new HttpError(400, "Công ty đã chọn không tồn tại.");
  }

  return Vacancy.create({
    companyId: input.companyId,
    department: input.department,
    title: input.title,
    quantity: input.quantity,
    status: input.status,
    workHours: input.workHours,
    overtime: input.overtime ?? null,
    baseSalary: input.baseSalary.toFixed(2),
    overtimeSalary: input.overtimeSalary == null ? null : input.overtimeSalary.toFixed(2),
    allowances: input.allowances ?? null,
    minimumAge: input.minimumAge ?? null,
    maximumAge: input.maximumAge ?? null,
    genderRequirement: input.genderRequirement,
  });
}

export async function updateVacancy(id: string, input: VacancyInput) {
  const vacancy = await Vacancy.findByPk(id);
  if (!vacancy) {
    throw new HttpError(404, "Không tìm thấy vị trí tuyển dụng.");
  }

  if (!(await Company.findByPk(input.companyId))) {
    throw new HttpError(400, "Công ty đã chọn không tồn tại.");
  }

  await vacancy.update({
    companyId: input.companyId,
    department: input.department,
    title: input.title,
    quantity: input.quantity,
    status: input.status,
    workHours: input.workHours,
    overtime: input.overtime ?? null,
    baseSalary: input.baseSalary.toFixed(2),
    overtimeSalary: input.overtimeSalary == null ? null : input.overtimeSalary.toFixed(2),
    allowances: input.allowances ?? null,
    minimumAge: input.minimumAge ?? null,
    maximumAge: input.maximumAge ?? null,
    genderRequirement: input.genderRequirement,
  });
  return vacancy;
}

export async function deleteVacancy(id: string) {
  const vacancy = await Vacancy.findByPk(id);
  if (!vacancy) {
    throw new HttpError(404, "Không tìm thấy vị trí tuyển dụng.");
  }

  if (await Application.count({ where: { vacancyId: id } })) {
    throw new HttpError(409, "Không thể xóa vị trí đã có hồ sơ ứng tuyển.");
  }

  await vacancy.destroy();
}
