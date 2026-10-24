import { Application, Company, Vacancy } from "../models/index.js";

export async function getRecruitmentDashboard() {
  const [
    companyCount,
    vacancyCount,
    openVacancyCount,
    pausedVacancyCount,
    closedVacancyCount,
    applicationCount,
    submittedApplicationCount,
    reviewingApplicationCount,
    acceptedApplicationCount,
    rejectedApplicationCount,
  ] = await Promise.all([
    Company.count(),
    Vacancy.count(),
    Vacancy.count({ where: { status: "open" } }),
    Vacancy.count({ where: { status: "paused" } }),
    Vacancy.count({ where: { status: "closed" } }),
    Application.count(),
    Application.count({ where: { status: "submitted" } }),
    Application.count({ where: { status: "reviewing" } }),
    Application.count({ where: { status: "accepted" } }),
    Application.count({ where: { status: "rejected" } }),
  ]);

  return {
    companies: companyCount,
    vacancies: {
      total: vacancyCount,
      open: openVacancyCount,
      paused: pausedVacancyCount,
      closed: closedVacancyCount,
    },
    applications: {
      total: applicationCount,
      submitted: submittedApplicationCount,
      reviewing: reviewingApplicationCount,
      accepted: acceptedApplicationCount,
      rejected: rejectedApplicationCount,
    },
  };
}
