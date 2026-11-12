"use client";

import { SparkIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <EmptyState
      icon={<SparkIcon />}
      title="Something went wrong on our side"
      action={
        <Button variant="secondary" onClick={() => reset()}>
          Try again
        </Button>
      }
    >
      It&rsquo;s not you. Give it another go, and if it keeps happening, tell someone at the help desk.
    </EmptyState>
  );
}
