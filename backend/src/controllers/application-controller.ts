import type { Request, Response } from "express";

import {
  createApplication,
  listApplications,
  updateApplicationStatus,
} from "../services/application-service.js";
import { getRouteParam } from "../utils/http-error.js";

export async function create(request: Request, response: Response) {
  const application = await createApplication(request.body);
  response.status(201).json({ application });
}

export async function list(request: Request, response: Response) {
  response.json(await listApplications(request.validatedQuery ?? request.query));
}

export async function updateStatus(request: Request, response: Response) {
  const application = await updateApplicationStatus(
    getRouteParam(request.params.id, "id"),
    request.body.status
  );
  response.json({ application });
}
