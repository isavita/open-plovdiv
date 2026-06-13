import budgetItemsJson from "../../../../data/curated/budget-items.json";
import fixReportsJson from "../../../../data/curated/fix-reports.json";
import projectsJson from "../../../../data/curated/projects.json";
import sourcesJson from "../../../../data/curated/sources.json";

export type Source = {
  title: string;
  url: string;
  accessed_at: string;
};

export type Location = {
  lat: number;
  lng: number;
  address_bg: string;
};

export type Project = {
  id: string;
  title_bg: string;
  title_en: string;
  summary_bg: string;
  category: string;
  status: string;
  municipality: "plovdiv";
  district: string | null;
  location: Location;
  budget: {
    amount_bgn: number;
    year: number;
    funding_source: string;
  };
  related_budget_item_id: string;
  timeline?: Array<{
    date: string;
    label_bg: string;
    source_url: string;
  }>;
  sources: Source[];
  data_quality: string;
  updated_at: string;
};

export type FixReport = {
  id: string;
  title_bg: string;
  description_bg: string;
  category: string;
  status: string;
  location: Location;
  photo_url: string | null;
  submitted_source: string;
  sources: Source[];
  data_quality: string;
  created_at: string;
  updated_at: string;
};

export type BudgetItem = {
  id: string;
  year: number;
  municipality: "plovdiv";
  category: string;
  title_bg: string;
  amount_bgn: number;
  plain_language_bg?: string;
  source_document: Source;
  data_quality: string;
};

export type SourceRegistryItem = {
  id: string;
  title_bg: string;
  url: string;
  used_for: string;
  accessed_at: string;
  limitations_bg: string;
};

export const projects = projectsJson as Project[];
export const fixReports = fixReportsJson as FixReport[];
export const budgetItems = budgetItemsJson as BudgetItem[];
export const sourceRegistry = sourcesJson as SourceRegistryItem[];
