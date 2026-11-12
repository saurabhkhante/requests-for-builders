import { PREVIEW_SIZE, requestPreview, visibleRequestIds } from "../../_og/request-preview";

/** Link preview for one problem. The layout lives in _og/request-preview.tsx. */
export const alt = "A problem from Requests for Builders, Builder's Day, Sun 22 Nov, Bengaluru";
export const size = PREVIEW_SIZE;
export const contentType = "image/png";

export const generateStaticParams = visibleRequestIds;

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return requestPreview(id);
}
