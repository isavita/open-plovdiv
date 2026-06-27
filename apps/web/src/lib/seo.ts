import { localizePath, type Lang } from "@i18n/utils";

export type JsonLdScalar = string | number | boolean | null;
export type JsonLdValue = JsonLdScalar | JsonLdObject | JsonLdValue[];
export type JsonLdObject = {
  [key: string]: JsonLdValue | undefined;
};

export type BreadcrumbLabelMap = Record<string, string>;

export type StructuredDataOptions = {
  site: URL;
  lang: Lang;
  locale: string;
  siteName: string;
  logicalPath: string;
  canonical: string;
  title: string;
  description: string;
  image?: string;
  breadcrumbLabels?: BreadcrumbLabelMap;
  additional?: JsonLdObject | JsonLdObject[];
};

export function absoluteUrl(pathOrUrl: string | undefined, site: URL): string | undefined {
  if (!pathOrUrl) return undefined;
  return new URL(pathOrUrl, site).href;
}

export function inferOpenGraphType(path: string): "article" | "profile" | "website" {
  if (path.startsWith("/people/") || path.startsWith("/mayors/")) return "profile";
  if (path.startsWith("/stories/")) return "article";
  return "website";
}

export function buildPageStructuredData(options: StructuredDataOptions): JsonLdObject[] {
  const siteRoot = new URL("/", options.site).href;
  const websiteId = `${siteRoot}#website`;
  const organizationId = `${siteRoot}#organization`;
  const webpageId = `${options.canonical}#webpage`;
  const breadcrumbId = `${options.canonical}#breadcrumb`;
  const inferredEntity = inferPrimaryEntity(options);

  const defaults: JsonLdObject[] = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": websiteId,
      url: siteRoot,
      name: options.siteName,
      inLanguage: options.locale,
      publisher: { "@id": organizationId }
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": organizationId,
      name: options.siteName,
      url: siteRoot
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": webpageId,
      url: options.canonical,
      name: options.title,
      description: options.description,
      inLanguage: options.locale,
      isPartOf: { "@id": websiteId },
      about: { "@id": organizationId },
      breadcrumb: { "@id": breadcrumbId },
      primaryImageOfPage: options.image ? { "@type": "ImageObject", url: options.image } : undefined,
      mainEntity: inferredEntity ? { "@id": inferredEntity["@id"] } : undefined
    },
    buildBreadcrumbList({
      id: breadcrumbId,
      site: options.site,
      lang: options.lang,
      logicalPath: options.logicalPath,
      currentTitle: options.title,
      homeLabel: options.breadcrumbLabels?.home ?? options.siteName,
      labels: options.breadcrumbLabels ?? {}
    })
  ];

  if (inferredEntity) defaults.push(inferredEntity);
  return dedupeJsonLd([...defaults, ...toJsonLdArray(options.additional)]);
}

export function serializeJsonLd(nodes: JsonLdObject[]): string {
  return JSON.stringify(nodes).replace(/</g, "\\u003c");
}

function buildBreadcrumbList(options: {
  id: string;
  site: URL;
  lang: Lang;
  logicalPath: string;
  currentTitle: string;
  homeLabel: string;
  labels: BreadcrumbLabelMap;
}): JsonLdObject {
  const segments = splitPath(options.logicalPath);
  const itemListElement: JsonLdObject[] = [
    {
      "@type": "ListItem",
      position: 1,
      name: options.homeLabel,
      item: new URL(localizePath("/", options.lang), options.site).href
    }
  ];

  segments.forEach((segment, index) => {
    const logicalPath = `/${segments.slice(0, index + 1).join("/")}`;
    const isLast = index === segments.length - 1;
    itemListElement.push({
      "@type": "ListItem",
      position: index + 2,
      name: isLast ? options.currentTitle : options.labels[segment] ?? titleizeSegment(segment),
      item: new URL(localizePath(logicalPath, options.lang), options.site).href
    });
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": options.id,
    itemListElement
  };
}

function inferPrimaryEntity(options: StructuredDataOptions): JsonLdObject | null {
  const base = {
    url: options.canonical,
    name: options.title,
    description: options.description,
    inLanguage: options.locale,
    image: options.image
  };

  if (options.logicalPath.startsWith("/places/")) {
    return {
      "@context": "https://schema.org",
      "@type": ["Place", "TouristAttraction"],
      "@id": `${options.canonical}#place`,
      ...base
    };
  }

  if (options.logicalPath.startsWith("/people/") || options.logicalPath.startsWith("/mayors/")) {
    return {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": `${options.canonical}#person`,
      ...base
    };
  }

  return null;
}

function splitPath(path: string): string[] {
  return path
    .split("/")
    .map((segment) => segment.trim())
    .filter(Boolean);
}

function titleizeSegment(segment: string): string {
  return segment
    .split("-")
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toLocaleUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function toJsonLdArray(nodes: JsonLdObject | JsonLdObject[] | undefined): JsonLdObject[] {
  if (!nodes) return [];
  return Array.isArray(nodes) ? nodes : [nodes];
}

function dedupeJsonLd(nodes: JsonLdObject[]): JsonLdObject[] {
  const seen = new Map<string, JsonLdObject>();
  nodes.forEach((node, index) => {
    seen.set(jsonLdIdentity(node, index), node);
  });
  return Array.from(seen.values());
}

function jsonLdIdentity(node: JsonLdObject, index: number): string {
  const id = node["@id"];
  if (typeof id === "string") return id;
  const type = node["@type"];
  const url = node.url;
  const name = node.name;
  if (typeof type === "string" && typeof url === "string") return `${type}:${url}`;
  if (Array.isArray(type) && typeof url === "string") return `${type.join("+")}:${url}`;
  if (typeof type === "string" && typeof name === "string") return `${type}:${name}`;
  return `node:${index}`;
}
