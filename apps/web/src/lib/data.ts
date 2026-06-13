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
  address_en?: string;
};

export type Project = {
  id: string;
  title_bg: string;
  title_en: string;
  summary_bg: string;
  summary_en?: string;
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
    label_en?: string;
    source_url: string;
  }>;
  sources: Source[];
  data_quality: string;
  updated_at: string;
};

export type FixReport = {
  id: string;
  title_bg: string;
  title_en?: string;
  description_bg: string;
  description_en?: string;
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
  title_en?: string;
  amount_bgn: number;
  plain_language_bg?: string;
  plain_language_en?: string;
  source_document: Source;
  data_quality: string;
};

export type SourceRegistryItem = {
  id: string;
  title_bg: string;
  title_en?: string;
  url: string;
  used_for: string;
  used_for_en?: string;
  accessed_at: string;
  limitations_bg: string;
  limitations_en?: string;
};

export const projects = projectsJson as Project[];
export const fixReports = fixReportsJson as FixReport[];
export const budgetItems = budgetItemsJson as BudgetItem[];
export const sourceRegistry = sourcesJson as SourceRegistryItem[];
