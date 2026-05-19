import type { Metadata } from "next";
import { getBuiltin } from "@/lib/tools";

export const SITE_NAME = "web-tools";
export const SITE_URL = "https://web-tools.donjor.net";
export const SITE_DESCRIPTION =
  "A suite of browser-based tools — a card-grid dashboard for built-in and external utilities.";
export const SITE_CREATOR = "donjor";

const baseUrl = new URL(SITE_URL);

export function createRootMetadata(): Metadata {
  return {
    metadataBase: baseUrl,
    title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
    description: SITE_DESCRIPTION,
    applicationName: SITE_NAME,
    authors: [{ name: SITE_CREATOR, url: "https://github.com/donjor" }],
    creator: SITE_CREATOR,
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      url: SITE_URL,
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
    },
  };
}

export function createHomeMetadata(): Metadata {
  return {
    title: { absolute: SITE_NAME },
    description: SITE_DESCRIPTION,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      url: SITE_URL,
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
    },
  };
}

export function createToolMetadata(slug: string): Metadata {
  const tool = getBuiltin(slug);
  const title = tool?.title ?? slug;
  const description = tool?.description ?? SITE_DESCRIPTION;
  const path = `/${slug}`;
  const url = new URL(path, baseUrl).toString();
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      url,
      title: `${title} · ${SITE_NAME}`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · ${SITE_NAME}`,
      description,
    },
  };
}
