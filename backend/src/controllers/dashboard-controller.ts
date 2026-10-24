import type { Request, Response } from "express";

import { getRecruitmentDashboard } from "../services/dashboard-service.js";

export async function summary(_request: Request, response: Response) {
  response.json(await getRecruitmentDashboard());
}
