import budgetItemsJson from "../../../../data/curated/budget-items.json";
import cityArchiveJson from "../../../../data/curated/city-archive.json";
import communityInitiativesJson from "../../../../data/curated/community-initiatives.json";
import fixReportsJson from "../../../../data/curated/fix-reports.json";
import projectsJson from "../../../../data/curated/projects.json";
import sourcesJson from "../../../../data/curated/sources.json";
import historyJson from "../../../../data/curated/plovdiv-history.json";
import landmarksJson from "../../../../data/curated/plovdiv-landmarks.json";

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
  summary_key?: "total_budget" | "capital_programme" | "budget_execution";
  funding_key?: "eu_funds" | "own_remainder" | "programme_cofinancing" | "state_subsidy" | "other_sources";
  basis?: "adopted" | "executed" | "provisional" | "historical_nominal";
  display_order?: number;
  plain_language_bg?: string;
  plain_language_en?: string;
  source_document: Source;
  data_quality: string;
};

export type CityArchiveRecord = {
  id: string;
  municipality: "plovdiv";
  kind:
    | "mayor_term"
    | "historical_event"
    | "cultural_programme"
    | "historical_finance"
    | "municipal_programme"
    | "governance_change"
    | "archive_source";
  year_start: number;
  year_end?: number;
  period_bg: string;
  period_en?: string;
  title_bg: string;
  title_en?: string;
  actor_bg?: string;
  actor_en?: string;
  amount_bgn?: number;
  amount_eur?: number;
  summary_bg: string;
  summary_en?: string;
  bio_bg?: string;
  bio_en?: string;
  more_url?: string;
  image?: string;
  image_credit?: string;
  fate?: "killed" | "executed" | "assassinated" | "died_in_office";
  fate_note_bg?: string;
  fate_note_en?: string;
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
  donation_url?: string;
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

export type HistoryEra =
  | "prehistory"
  | "thracian"
  | "roman"
  | "medieval"
  | "ottoman"
  | "revival"
  | "liberation"
  | "modern";

export type HistoryEntry = {
  id: string;
  era: HistoryEra;
  year: number;
  period_bg: string;
  period_en: string;
  title_bg: string;
  title_en: string;
  summary_bg: string;
  summary_en: string;
  source: Source;
  data_quality: string;
};

export type LandmarkCategory = "thracian" | "roman" | "ottoman" | "revival" | "religious" | "hill";

export type Landmark = {
  id: string;
  category: LandmarkCategory;
  era_bg: string;
  era_en: string;
  name_bg: string;
  name_en: string;
  summary_bg: string;
  summary_en: string;
  source: Source;
  data_quality: string;
};

export const projects = projectsJson as Project[];
export const communityInitiatives = communityInitiativesJson as CommunityInitiative[];
export const fixReports = fixReportsJson as FixReport[];
export const budgetItems = budgetItemsJson as BudgetItem[];
export const cityArchive = cityArchiveJson as CityArchiveRecord[];
export const plovdivHistory = historyJson as HistoryEntry[];
export const plovdivLandmarks = landmarksJson as Landmark[];
export const sourceRegistry = sourcesJson as SourceRegistryItem[];
