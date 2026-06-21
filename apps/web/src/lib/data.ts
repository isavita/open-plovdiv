import budgetItemsJson from "../../../../data/curated/budget-items.json";
import cityArchiveJson from "../../../../data/curated/city-archive.json";
import communityInitiativesJson from "../../../../data/curated/community-initiatives.json";
import fixReportsJson from "../../../../data/curated/fix-reports.json";
import projectsJson from "../../../../data/curated/projects.json";
import sourcesJson from "../../../../data/curated/sources.json";
import historyJson from "../../../../data/curated/plovdiv-history.json";
import landmarksJson from "../../../../data/curated/plovdiv-landmarks.json";
import populationJson from "../../../../data/curated/plovdiv-population.json";
import neighbourhoodsJson from "../../../../data/curated/plovdiv-neighbourhoods.json";
import climateJson from "../../../../data/curated/plovdiv-climate.json";
import historyKnowledgeIndexJson from "../../../../data/generated/history-knowledge/index.json";
import historyKnowledgeEventsJson from "../../../../data/generated/history-knowledge/events.json";
import historyKnowledgePeopleJson from "../../../../data/generated/history-knowledge/people.json";
import historyKnowledgePlacesJson from "../../../../data/generated/history-knowledge/places.json";
import historyKnowledgeOrganizationsJson from "../../../../data/generated/history-knowledge/organizations.json";
import historyKnowledgeSourcesJson from "../../../../data/generated/history-knowledge/sources.json";
import historicalArchiveItemsJson from "../../../../data/generated/history-knowledge/archive-items.json";
import thenNowPairsJson from "../../../../data/generated/history-knowledge/then-now-pairs.json";
import primaryDocumentsJson from "../../../../data/generated/history-knowledge/primary-documents.json";
import educationResourcesJson from "../../../../data/generated/history-knowledge/education-resources.json";
import storyLongreadsJson from "../../../../data/generated/history-knowledge/story-longreads.json";
import historyEditorialSignoffsJson from "../../../../data/generated/history-knowledge/editorial-signoffs.json";
import historyEditorialReviewJson from "../../../../data/generated/history-knowledge/editorial-review.json";
import historySourceCoverageJson from "../../../../data/generated/history-knowledge/source-coverage.json";

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
  birthplace_bg?: string;
  birthplace_en?: string;
  birth_lat?: number;
  birth_lng?: number;
  birth_country_bg?: string;
  birth_country_en?: string;
  birth_wikidata?: string;
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

export type LandmarkCategory =
  | "thracian"
  | "roman"
  | "medieval"
  | "ottoman"
  | "revival"
  | "religious"
  | "hill"
  | "civic"
  | "monument";

export type Landmark = {
  id: string;
  category: LandmarkCategory;
  era_bg: string;
  era_en: string;
  name_bg: string;
  name_en: string;
  summary_bg: string;
  summary_en: string;
  wikidata_id?: string;
  built_year?: number | null;
  built_date?: string;
  architect_bg?: string;
  architect_en?: string;
  builder_bg?: string;
  builder_en?: string;
  source: Source;
  data_quality: string;
};

export type KnowledgeEditorialStatus = "needs_editorial_signoff" | "signed_off";

export type KnowledgeEditorial = {
  status: KnowledgeEditorialStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  notes_bg: string;
  notes_en: string;
};

export type KnowledgeProvenance = Array<{
  source_id: string;
  evidence_type: string;
  claim_bg: string;
  claim_en: string;
  url: string;
  accessed_at: string;
  license_status: string;
}>;

export type KnowledgeEvent = {
  id: string;
  type: "event";
  category: string;
  era: HistoryEra;
  date: {
    year: number;
    year_end: number | null;
    month?: number | null;
    day?: number | null;
    month_end?: number | null;
    day_end?: number | null;
    precision: string;
    display_bg: string;
    display_en: string;
  };
  title_bg: string;
  title_en: string;
  summary_bg: string;
  summary_en: string;
  conflict_notes_bg?: string | null;
  conflict_notes_en?: string | null;
  theme_tags: string[];
  person_ids: string[];
  place_ids: string[];
  organization_ids: string[];
  source_ids: string[];
  provenance: KnowledgeProvenance;
  editorial: KnowledgeEditorial;
};

export type KnowledgePerson = {
  id: string;
  type: "person";
  wikidata_id: string | null;
  name_bg: string;
  name_en: string;
  summary_bg: string;
  summary_en: string;
  roles: string[];
  birth_year: number | null;
  death_year: number | null;
  image: string | null;
  image_credit: string | null;
  term_events: string[];
  event_ids: string[];
  place_ids: string[];
  organization_ids: string[];
  source_ids: string[];
  relationships: Array<{
    type:
      | "succeeds"
      | "succeeded_by"
      | "spouse"
      | "father"
      | "mother"
      | "parent"
      | "child"
      | "sibling"
      | "mentor"
      | "student"
      | "partner"
      | "influenced_by";
    person_id: string;
    event_id: string | null;
    source_id: string;
    evidence_property?: string;
  }>;
  provenance: KnowledgeProvenance;
  editorial: KnowledgeEditorial;
};

export type KnowledgePlace = {
  id: string;
  type: "place";
  category: string;
  era: HistoryEra;
  era_bg: string;
  era_en: string;
  name_bg: string;
  name_en: string;
  summary_bg: string;
  summary_en: string;
  wikidata_id: string | null;
  built_year: number | null;
  built_date: string | null;
  date_context: {
    precision: "date" | "year" | "era";
    display_bg: string;
    display_en: string;
    source_id: string;
  };
  architect_bg: string | null;
  architect_en: string | null;
  builder_bg: string | null;
  builder_en: string | null;
  creator_context: {
    status: "named" | "not_identified" | "not_applicable";
    display_bg: string;
    display_en: string;
    source_id: string;
  };
  coordinates: {
    lat: number;
    lng: number;
    accuracy: string;
    source_id: string;
  } | null;
  current_status_bg: string;
  current_status_en: string;
  media: Array<{
    type: "image";
    title: string;
    url: string;
    page_url: string;
    credit: string;
    license: string;
    license_url: string;
    accessed_at: string;
    source_id: string;
  }>;
  event_ids: string[];
  person_ids: string[];
  organization_ids: string[];
  archive_item_ids: string[];
  then_now_pair_ids: string[];
  source_ids: string[];
  provenance: KnowledgeProvenance;
  editorial: KnowledgeEditorial;
};

export type KnowledgeOrganization = {
  id: string;
  type: "organization";
  category: string;
  name_bg: string;
  name_en: string;
  summary_bg: string;
  summary_en: string;
  event_ids: string[];
  person_ids: string[];
  place_ids: string[];
  source_ids: string[];
  provenance: KnowledgeProvenance;
  editorial: KnowledgeEditorial;
};

export type KnowledgeSource = {
  id: string;
  type: "source";
  title_bg: string;
  title_en: string;
  publisher: string;
  url: string;
  accessed_at: string;
  license: {
    status: "open_license" | "public_reference_terms_unverified";
    label: string;
    url: string;
  };
  used_for_bg: string;
  used_for_en: string;
  limitations_bg: string;
  limitations_en: string;
};

export type ArchiveMedia = {
  type: "image";
  title: string;
  url: string;
  page_url: string;
  credit: string;
  license: string;
  license_url: string;
  accessed_at: string;
  source_id?: string;
};

export type HistoricalArchiveItem = {
  id: string;
  kind: "photo" | "map" | "document";
  place_id: string;
  title_bg: string;
  title_en: string;
  description_bg: string;
  description_en: string;
  date_year: number;
  date_display_bg: string;
  date_display_en: string;
  coordinates: {
    lat: number;
    lng: number;
    accuracy: string;
    source_place_id: string;
  };
  georeference: {
    method: string;
    confidence: string;
    notes_bg: string;
    notes_en: string;
  };
  overlay_bounds?: {
    south: number;
    west: number;
    north: number;
    east: number;
    method: "approximate_extent" | "manual_control_points";
    notes_bg: string;
    notes_en: string;
  };
  media: ArchiveMedia;
  source: Source & {
    license: {
      status: "open_license";
      label: string;
      url: string;
    };
  };
  commons_categories: string[];
  data_quality: string;
  editorial: KnowledgeEditorial;
};

export type ThenNowPair = {
  id: string;
  place_id: string;
  historical_archive_item_id: string;
  title_bg: string;
  title_en: string;
  caption_bg: string;
  caption_en: string;
  then_media: ArchiveMedia;
  now_media: ArchiveMedia;
  source_ids: string[];
  provenance: KnowledgeProvenance;
  match_quality: string;
  data_quality: string;
  editorial: KnowledgeEditorial;
};

export type PrimaryDocument = {
  id: string;
  type: "primary_document";
  kind: "municipal_decision" | "state_gazette_decree" | "municipal_rule" | "council_minutes" | "period_press" | "other";
  date: string;
  date_year: number;
  title_bg: string;
  title_en: string;
  summary_bg: string;
  summary_en: string;
  transcription: {
    type: "excerpt" | "full" | "diplomatic_excerpt";
    original_language: string;
    excerpt_bg: string;
    excerpt_en: string;
    notes_bg: string;
    notes_en: string;
  };
  linked_event_ids: string[];
  linked_budget_item_ids: string[];
  linked_place_ids: string[];
  linked_organization_ids: string[];
  source: Source & {
    license: {
      status: "open_license" | "public_reference_terms_unverified";
      label: string;
      url: string;
    };
  };
  source_ids: string[];
  provenance: KnowledgeProvenance;
  data_quality: string;
  editorial: KnowledgeEditorial;
};

export type EducationResource = {
  id: string;
  audience_bg: string;
  audience_en: string;
  duration_minutes: number;
  era_tags: HistoryEra[];
  subject_tags: string[];
  title_bg: string;
  title_en: string;
  summary_bg: string;
  summary_en: string;
  driving_question_bg: string;
  driving_question_en: string;
  objectives_bg: string[];
  objectives_en: string[];
  preparation_bg: string;
  preparation_en: string;
  lesson_steps: Array<{
    minutes: number;
    phase_bg: string;
    phase_en: string;
    activity_bg: string;
    activity_en: string;
  }>;
  quiz: Array<{
    question_bg: string;
    question_en: string;
    answers_bg: string[];
    answers_en: string[];
    correct_answer_index: number;
    explanation_bg: string;
    explanation_en: string;
  }>;
  printable_handout: {
    title_bg: string;
    title_en: string;
    tasks_bg: string[];
    tasks_en: string[];
  };
  audio_tour: {
    title_bg: string;
    title_en: string;
    production_status: "script_ready" | "recorded";
    stops: Array<{
      place_id: string;
      title_bg: string;
      title_en: string;
      narration_bg: string;
      narration_en: string;
    }>;
  };
  linked_event_ids: string[];
  linked_place_ids: string[];
  linked_archive_item_ids: string[];
  linked_then_now_pair_ids: string[];
  source_ids: string[];
  provenance?: KnowledgeProvenance;
  data_quality: string;
  editorial: KnowledgeEditorial;
};

export type StoryLongread = {
  id: string;
  title_bg: string;
  title_en: string;
  dek_bg: string;
  dek_en: string;
  reading_minutes: number;
  era_tags: HistoryEra[];
  theme_tags: string[];
  hero: {
    kind: "archive_item" | "then_now_pair" | "place_media";
    ref_id: string;
    caption_bg: string;
    caption_en: string;
  };
  sections: Array<{
    heading_bg: string;
    heading_en: string;
    body_bg: string;
    body_en: string;
    source_ids: string[];
    linked_event_ids: string[];
    linked_place_ids: string[];
  }>;
  linked_event_ids: string[];
  linked_place_ids: string[];
  linked_archive_item_ids: string[];
  linked_then_now_pair_ids: string[];
  source_ids: string[];
  provenance?: KnowledgeProvenance;
  data_quality: string;
  editorial: KnowledgeEditorial;
};

export type HistoryKnowledgeIndex = {
  version: string;
  generated_at: string;
  license_note: string;
  counts: Record<string, number>;
  targets: Record<string, number>;
  endpoints: Record<string, string>;
  downloads: Record<string, string>;
};

export type EditorialReviewRecord = {
  id: string;
  collection: string;
  role: string;
  title_bg: string;
  title_en: string;
  editorial_status: KnowledgeEditorialStatus | "missing_editorial_status";
  reviewed_by: string | null;
  reviewed_at: string | null;
  signoff_id: string | null;
  reviewer_affiliation: string | null;
  review_scope: string[];
  review_artifact_url: string | null;
  review_notes_bg: string | null;
  review_notes_en: string | null;
  review_url_bg: string;
  review_url_en: string;
  api_url: string;
  review_sources: {
    source_id: string | null;
    title_bg: string;
    title_en: string;
    url: string;
    accessed_at: string;
    license_status: string | null;
    license_label: string | null;
    license_url: string | null;
    evidence_type: string | null;
    claim_bg: string;
    claim_en: string;
  }[];
  source_ids: string[];
  source_urls: string[];
  license_statuses: string[];
  source_count: number;
  has_license_or_reuse_status: boolean;
  blockers: string[];
};

export type EditorialSignoff = {
  id: string;
  collection: string;
  record_id: string;
  decision: "signed_off";
  reviewed_by: string;
  reviewer_affiliation: string;
  reviewed_at: string;
  review_scope: string[];
  review_artifact_url: string;
  notes_bg: string;
  notes_en: string;
};

export type EditorialReviewCollection = {
  label_bg: string;
  label_en: string;
  role: string;
  total_records: number;
  signed_off_records: number;
  records_needing_review: number;
  records_with_blockers: number;
};

export type HistoryEditorialReview = {
  version: string;
  generated_at: string;
  acceptance_requirement: string;
  status: "complete" | "incomplete";
  summary: {
    total_tracked_records: number;
    signed_off_records: number;
    records_needing_review: number;
    records_with_blockers: number;
    signed_off_percent: number;
    tracking_gap_collections: number;
  };
  collections: Record<string, EditorialReviewCollection>;
  tracking_gaps: string[];
  records: EditorialReviewRecord[];
};

export type SourceCoverageSummary = {
  total_records: number;
  records_with_sources: number;
  records_without_sources: number;
  records_with_license_or_reuse_status: number;
  records_missing_license_or_reuse_status: number;
  single_source_records: number;
  multi_source_records: number;
  needs_multi_source_review_records: number;
  open_license_records: number;
  public_reference_terms_records: number;
};

export type SourceCoverageCollection = SourceCoverageSummary & {
  label_bg: string;
  label_en: string;
  role: string;
};

export type SourceCoverageRecord = {
  id: string;
  collection: string;
  role: string;
  title_bg: string;
  title_en: string;
  review_url_bg: string;
  review_url_en: string;
  api_url: string;
  source_count: number;
  source_ids: string[];
  source_urls: string[];
  license_statuses: string[];
  has_open_license: boolean;
  has_public_reference_terms: boolean;
  has_license_or_reuse_status: boolean;
  needs_multi_source_review: boolean;
  editorial_status: KnowledgeEditorialStatus | "missing_editorial_status";
  blockers: string[];
};

export type HistorySourceCoverage = {
  version: string;
  generated_at: string;
  purpose: string;
  source_traceability_status: "complete" | "incomplete";
  multi_source_review_status: "complete" | "needs_review";
  summary: SourceCoverageSummary;
  collections: Record<string, SourceCoverageCollection>;
  license_statuses: Record<string, number>;
  records: SourceCoverageRecord[];
};

export const projects = projectsJson as Project[];
export const communityInitiatives = communityInitiativesJson as CommunityInitiative[];
export const fixReports = fixReportsJson as FixReport[];
export const budgetItems = budgetItemsJson as BudgetItem[];
export const cityArchive = cityArchiveJson as CityArchiveRecord[];
export const plovdivHistory = historyJson as HistoryEntry[];
export const plovdivLandmarks = landmarksJson as Landmark[];

export type PopulationPoint = {
  id: string;
  year: number;
  population: number;
  note_bg?: string;
  note_en?: string;
  source: Source;
};

export type NeighbourhoodEra = "ottoman" | "revival" | "modern" | "socialist";

export type Neighbourhood = {
  id: string;
  name_bg: string;
  name_en: string;
  era_key: NeighbourhoodEra;
  year: number;
  period_bg: string;
  period_en: string;
  summary_bg: string;
  summary_en: string;
  lat: number;
  lng: number;
  approximate?: boolean;
  source: Source;
};

export const plovdivPopulation = populationJson as PopulationPoint[];
export const plovdivNeighbourhoods = neighbourhoodsJson as Neighbourhood[];

export type ClimateMonth = {
  id: string;
  month: number;
  high: number;
  low: number;
  precip: number;
  source: Source;
};

export const plovdivClimate = climateJson as ClimateMonth[];
export const sourceRegistry = sourcesJson as SourceRegistryItem[];
export const historyKnowledgeIndex = historyKnowledgeIndexJson as HistoryKnowledgeIndex;
export const historyKnowledgeEvents = historyKnowledgeEventsJson as KnowledgeEvent[];
export const historyKnowledgePeople = historyKnowledgePeopleJson as KnowledgePerson[];
export const historyKnowledgePlaces = historyKnowledgePlacesJson as KnowledgePlace[];
export const historyKnowledgeOrganizations = historyKnowledgeOrganizationsJson as KnowledgeOrganization[];
export const historyKnowledgeSources = historyKnowledgeSourcesJson as KnowledgeSource[];
export const historicalArchiveItems = historicalArchiveItemsJson as HistoricalArchiveItem[];
export const thenNowPairs = thenNowPairsJson as ThenNowPair[];
export const primaryDocuments = primaryDocumentsJson as PrimaryDocument[];
export const educationResources = educationResourcesJson as EducationResource[];
export const storyLongreads = storyLongreadsJson as StoryLongread[];
export const historyEditorialSignoffs = historyEditorialSignoffsJson as EditorialSignoff[];
export const historyEditorialReview = historyEditorialReviewJson as HistoryEditorialReview;
export const historySourceCoverage = historySourceCoverageJson as HistorySourceCoverage;
