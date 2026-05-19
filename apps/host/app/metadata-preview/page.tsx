import type { Metadata } from "next";
import {
  SITE_NAME,
  SITE_URL,
  createHomeMetadata,
  createToolMetadata,
} from "@/lib/metadata";
import { tools } from "@/lib/tools";
import { isBuiltin, isExternal } from "@web-tools/tool-kit";
import { urlConfig } from "@root/urls.config";
import {
  MetadataPreviewCard,
  type MetadataSummary,
} from "@/components/metadata-preview-card";

export const metadata: Metadata = {
  title: "Metadata preview",
  description: "Local preview of share-card metadata for each web-tools route.",
  robots: { index: false, follow: false },
};

type RouteSpec = {
  label: string;
  path: string;
  meta: Metadata;
};

const routes: RouteSpec[] = [
  { label: "Dashboard", path: "/", meta: createHomeMetadata() },
  ...tools.filter(isBuiltin).map((t) => ({
    label: t.title,
    path: `/${t.slug}`,
    meta: createToolMetadata(t.slug),
  })),
];

export default function MetadataPreviewPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">
          Metadata preview
        </h1>
        <p className="mt-2 max-w-prose text-sm text-(--color-muted-foreground)">
          How each route looks when shared (iMessage, Slack, Discord, Twitter,
          etc. — they all render approximately this same card from the OG
          tags). Built from{" "}
          <code className="font-mono text-xs">lib/metadata.ts</code> + the live
          OG image routes — same source of truth the real share preview uses.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {routes.map((r) => (
          <article key={r.path} className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-lg font-medium">{r.label}</h2>
              <a
                href={r.path}
                className="font-mono text-xs text-(--color-muted-foreground) hover:underline"
              >
                {r.path}
              </a>
            </div>
            <MetadataPreviewCard meta={summarize(r)} />
          </article>
        ))}
      </section>

      <ExternalsSection />
    </div>
  );
}

function ExternalsSection() {
  const externals = tools.filter(isExternal);
  if (externals.length === 0) return null;
  return (
    <section className="mt-16">
      <h2 className="text-lg font-medium">External tools</h2>
      <p className="mt-1 text-sm text-(--color-muted-foreground)">
        Out of scope for this previewer — each external app owns its own
        metadata at its own subdomain. To preview an external's unfurl, run
        the metadata work inside that submodule.
      </p>
      <ul className="mt-4 space-y-1 font-mono text-xs">
        {externals.map((t) => (
          <li key={t.slug} className="flex items-center gap-2">
            <span className="text-(--color-muted-foreground)">{t.title}</span>
            <span className="text-(--color-muted-foreground)">→</span>
            <span>
              {t.subdomain}.{urlConfig.prodExternalBase}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function summarize({ label, path, meta }: RouteSpec): MetadataSummary {
  const url = new URL(path, SITE_URL).toString();
  const ogImagePath = path === "/" ? "/opengraph-image" : `${path}/opengraph-image`;
  const title = readTitle(meta.title) ?? SITE_NAME;
  const description = readString(meta.description) ?? "";
  const og = meta.openGraph ?? {};
  const tw = meta.twitter ?? {};
  return {
    label,
    path,
    url,
    title,
    description,
    ogImagePath,
    ogTitle: readTitle(og.title) ?? title,
    ogDescription: readString(og.description) ?? description,
    ogUrl: readString((og as { url?: string | URL }).url) ?? url,
    twitterCard:
      readString((tw as { card?: string }).card) ?? "summary_large_image",
    twitterTitle: readTitle((tw as { title?: Metadata["title"] }).title) ?? title,
    twitterDescription:
      readString((tw as { description?: string | null }).description) ?? description,
  };
}

// Metadata.title can be a string, { absolute }, { default, template }, or { template, default }.
function readTitle(t: Metadata["title"] | undefined): string | undefined {
  if (t == null) return undefined;
  if (typeof t === "string") return t;
  if ("absolute" in t && t.absolute) return t.absolute;
  if ("default" in t && t.default) return t.default;
  return undefined;
}

function readString(v: unknown): string | undefined {
  if (v == null) return undefined;
  if (typeof v === "string") return v;
  if (v instanceof URL) return v.toString();
  return undefined;
}
