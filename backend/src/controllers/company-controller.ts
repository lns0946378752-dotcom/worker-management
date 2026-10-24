import type { Request, Response } from "express";

import { createCompany, deleteCompany, listCompanies, updateCompany } from "../services/company-service.js";
import { getRouteParam } from "../utils/http-error.js";

export async function list(request: Request, response: Response) {
  response.json(await listCompanies(request.validatedQuery ?? request.query));
}

export async function create(request: Request, response: Response) {
  response.status(201).json({ company: await createCompany(request.body) });
}

export async function update(request: Request, response: Response) {
  response.json({
    company: await updateCompany(getRouteParam(request.params.id, "id"), request.body),
  });
}

export async function remove(request: Request, response: Response) {
  await deleteCompany(getRouteParam(request.params.id, "id"));
  response.status(204).end();
}
