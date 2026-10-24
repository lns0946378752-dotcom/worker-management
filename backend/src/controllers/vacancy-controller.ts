import type { Request, Response } from "express";

import {
  createVacancy,
  deleteVacancy,
  listVacancies,
  updateVacancy,
} from "../services/vacancy-service.js";
import { getRouteParam } from "../utils/http-error.js";

export async function list(request: Request, response: Response) {
  response.json(await listVacancies(request.validatedQuery ?? request.query));
}

export async function create(request: Request, response: Response) {
  response.status(201).json({ vacancy: await createVacancy(request.body) });
}

export async function update(request: Request, response: Response) {
  response.json({
    vacancy: await updateVacancy(getRouteParam(request.params.id, "id"), request.body),
  });
}

export async function remove(request: Request, response: Response) {
  await deleteVacancy(getRouteParam(request.params.id, "id"));
  response.status(204).end();
}
