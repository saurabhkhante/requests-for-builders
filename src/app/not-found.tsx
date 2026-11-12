import { HelpIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <EmptyState
      icon={<HelpIcon />}
      title="We couldn’t find that page"
      action={
        <ButtonLink href="/" variant="secondary">
          Back to home
        </ButtonLink>
      }
    >
      The link might be old, or there might be a typo in it.
    </EmptyState>
  );
}
