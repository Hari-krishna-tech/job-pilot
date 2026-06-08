import { Send } from "lucide-react";

export function JobActions({ applyUrl }: { applyUrl: string }) {
  return (
    <div className="flex justify-end">
      <a
        href={applyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
      >
        Apply Now
        <Send className="h-4 w-4" />
      </a>
    </div>
  );
}
