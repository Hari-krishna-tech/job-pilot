"use client";

import { ChevronDown } from "lucide-react";

type FilterMatch = "all" | "high" | "low";
type SortOption = "match" | "newest" | "oldest";

type Props = {
  textFilter: string;
  matchFilter: FilterMatch;
  sortBy: SortOption;
  onTextFilterChange: (value: string) => void;
  onMatchFilterChange: (value: FilterMatch) => void;
  onSortByChange: (value: SortOption) => void;
};

export function JobFilters({
  textFilter,
  matchFilter,
  sortBy,
  onTextFilterChange,
  onMatchFilterChange,
  onSortByChange,
}: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1 max-w-sm">
        <input
          type="text"
          value={textFilter}
          onChange={(e) => onTextFilterChange(e.target.value)}
          placeholder="Filter by company or role..."
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <select
            value={matchFilter}
            onChange={(e) => onMatchFilterChange(e.target.value as FilterMatch)}
            className="appearance-none rounded-md border border-border bg-surface py-2 pl-3 pr-8 text-sm text-text-primary focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
          >
            <option value="all">All Matches</option>
            <option value="high">High Match</option>
            <option value="low">Low Match</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        </div>

        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as SortOption)}
            className="appearance-none rounded-md border border-border bg-surface py-2 pl-3 pr-8 text-sm text-text-primary focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
          >
            <option value="match">Match Score</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        </div>
      </div>
    </div>
  );
}
