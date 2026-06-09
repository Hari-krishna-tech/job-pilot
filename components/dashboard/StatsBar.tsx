import { TrendingUp } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  trend?: string;
};

function StatCard({ label, value, trend }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <p className="text-sm font-medium leading-5 text-text-secondary">
        {label}
      </p>
      <p className="mt-1.5 text-2xl sm:text-[30px] font-semibold sm:leading-9 text-text-primary">
        {value}
      </p>
      {trend && (
        <div className="mt-2 flex items-center gap-1">
          <div className="inline-flex items-center gap-1 rounded-sm bg-success-lightest px-2 py-0.5">
            <TrendingUp className="h-3 w-3 text-success-darker" />
            <span className="text-xs font-medium leading-4 text-success-darker">
              {trend}
            </span>
          </div>
          <span className="text-xs leading-4 text-text-muted">this week</span>
        </div>
      )}
    </div>
  );
}

type StatsBarProps = {
  totalJobs: number;
  avgMatchRate: number;
  companiesResearched: number;
  jobsThisWeek: number;
};

export function StatsBar({
  totalJobs,
  avgMatchRate,
  companiesResearched,
  jobsThisWeek,
}: StatsBarProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Total Jobs Found" value={String(totalJobs)} />
      <StatCard label="Avg. Match Rate" value={`${avgMatchRate}%`} />
      <StatCard label="Companies Researched" value={String(companiesResearched)} />
      <StatCard label="Jobs This Week" value={String(jobsThisWeek)} />
    </div>
  );
}
