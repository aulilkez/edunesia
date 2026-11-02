import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { Button } from "@edunesia/ui/components/button";

export function StartLearningButton({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <Button asChild size="lg" className={`h-11 rounded-full px-4 text-sm sm:px-5 ${className}`}>
      <Link to="/learn">
        {label}
        <ArrowRight aria-hidden="true" />
      </Link>
    </Button>
  );
}
