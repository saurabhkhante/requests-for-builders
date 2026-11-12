import { requestPreview, visibleRequestIds } from "../../../_og/request-preview";
import { ogScale } from "../../../_og/shared";

/**
 * The same link preview as ./opengraph-image, as a plain route so it can take
 * ?scale=2 (1–3) for a hi-res copy, e.g. 2400×1260.
 */
export const generateStaticParams = visibleRequestIds;

export async function GET(req: globalThis.Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return requestPreview(id, ogScale(req));
}
