import budgetItemsJson from "../../../../data/curated/budget-items.json";
import communityInitiativesJson from "../../../../data/curated/community-initiatives.json";
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
  approximate?: boolean;
};

export type Project = {
  id: string;
  title_bg: string;
  title_en: string;
  summary_bg: string;
  summary_en?: string;
  category: string;
  status: string;
  note_bg?: string;
  note_en?: string;
  municipality: "plovdiv";
  district: string | null;
  location: Location;
  budget: {
    amount_bgn?: number;
    amount_eur?: number;
    currency?: "BGN" | "EUR";
    year: number;
    funding_source: string;
  };
  related_budget_item_id?: string;
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
  kind: "summary" | "sector" | "funding_source";
  category: string;
  title_bg: string;
  title_en?: string;
  amount_bgn?: number;
  amount_eur?: number;
  currency?: "BGN" | "EUR";
  share_percent?: number;
  summary_key?: "total_budget" | "capital_programme";
  funding_key?: "eu_funds" | "own_remainder" | "programme_cofinancing" | "state_subsidy" | "other_sources";
  display_order?: number;
  plain_language_bg?: string;
  plain_language_en?: string;
  source_document: Source;
  data_quality: string;
};

export type CommunityInitiative = {
  id: string;
  title_bg: string;
  title_en: string;
  summary_bg: string;
  summary_en?: string;
  category: string;
  status: string;
  organizer: {
    name_bg: string;
    name_en?: string;
    type: string;
    website_url?: string;
    facebook_url?: string;
    instagram_url?: string;
  };
  call_to_action_bg?: string;
  call_to_action_en?: string;
  location: Location;
  related_project_ids?: string[];
  tags?: string[];
  contact_links?: Array<{
    label_bg: string;
    label_en?: string;
    url: string;
    type: string;
  }>;
  sources: Source[];
  discovery: {
    method: "ai_search" | "admin_manual";
    query_bg?: string;
    query_en?: string;
    discovered_at: string;
    last_checked_at: string;
  };
  data_quality: string;
  updated_at: string;
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
export const communityInitiatives = communityInitiativesJson as CommunityInitiative[];
export const fixReports = fixReportsJson as FixReport[];
export const budgetItems = budgetItemsJson as BudgetItem[];
export const sourceRegistry = sourcesJson as SourceRegistryItem[];
