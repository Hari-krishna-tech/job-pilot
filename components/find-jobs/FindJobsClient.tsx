"use client";

import { useState, useMemo } from "react";
import type { JobRow } from "@/types";
import { MATCH_THRESHOLD } from "@/lib/utils";
import { JobFilters } from "./JobFilters";
import { JobsTable } from "./JobsTable";
import { JobsPagination } from "./JobsPagination";

const PAGE_SIZE = 20;

type FilterMatch = "all" | "high" | "low";
type SortOption = "match" | "newest" | "oldest";

type Props = {
  jobs: JobRow[];
};

export function FindJobsClient({ jobs }: Props) {
  const [textFilter, setTextFilter] = useState("");
  const [matchFilter, setMatchFilter] = useState<FilterMatch>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    let result = [...jobs];

    if (textFilter.trim()) {
      const q = textFilter.toLowerCase();
      result = result.filter(
        (j) =>
          j.company.toLowerCase().includes(q) ||
          j.title.toLowerCase().includes(q),
      );
    }

    if (matchFilter === "high") {
      result = result.filter((j) => (j.match_score ?? 0) >= MATCH_THRESHOLD);
    } else if (matchFilter === "low") {
      result = result.filter((j) => (j.match_score ?? 0) < MATCH_THRESHOLD);
    }

    if (sortBy === "match") {
      result.sort((a, b) => (b.match_score ?? 0) - (a.match_score ?? 0));
    } else if (sortBy === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.found_at).getTime() - new Date(a.found_at).getTime(),
      );
    } else {
      result.sort(
        (a, b) =>
          new Date(a.found_at).getTime() - new Date(b.found_at).getTime(),
      );
    }

    return result;
  }, [jobs, textFilter, matchFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
        <JobFilters
          textFilter={textFilter}
          matchFilter={matchFilter}
          sortBy={sortBy}
          onTextFilterChange={(v) => {
            setTextFilter(v);
            setCurrentPage(1);
          }}
          onMatchFilterChange={(v) => {
            setMatchFilter(v);
            setCurrentPage(1);
          }}
          onSortByChange={setSortBy}
        />
      </div>

      <JobsTable jobs={paginated} />

      <JobsPagination
        currentPage={page}
        totalResults={filtered.length}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
      />
    </>
  );
}
