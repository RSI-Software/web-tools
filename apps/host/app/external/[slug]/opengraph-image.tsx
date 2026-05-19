import { renderOgImage, ogSize, ogContentType } from "@/lib/og";
import { getExternal } from "@/lib/metadata";
import { tools } from "@/lib/tools";
import { isExternal } from "@web-tools/tool-kit";

export const size = ogSize;
export const contentType = ogContentType;

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return tools.filter(isExternal).map((t) => ({ slug: t.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const tool = getExternal(slug);
  return renderOgImage({
    title: tool?.title ?? slug,
    description: tool?.description,
    eyebrow: "external · web-tools",
  });
}
