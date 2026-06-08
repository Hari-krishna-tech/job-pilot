export type ActivityDot = {
  ringColor: string;
  innerColor: string;
};

export type ActivityEntry = {
  message: string;
  timestamp: string;
  dot: ActivityDot;
};

const JOB_FOUND_DOT: ActivityDot = {
  ringColor: "bg-success-light",
  innerColor: "bg-success-alt",
};

const COMPANY_RESEARCHED_DOT: ActivityDot = {
  ringColor: "bg-info-light",
  innerColor: "bg-info",
};

function ActivityItem({ entry }: { entry: ActivityEntry }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`mt-1 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full ${entry.dot.ringColor} ring-2 ring-surface`}
      >
        <div className={`h-2 w-2 rounded-full ${entry.dot.innerColor}`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-5 text-text-primary">
          {entry.message}
        </p>
        <p className="mt-0.5 text-xs leading-4 text-text-muted">
          {entry.timestamp}
        </p>
      </div>
    </div>
  );
}

export function RecentActivity({
  activities,
}: {
  activities: ActivityEntry[];
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <h2 className="text-base font-semibold leading-6 text-text-primary">
        Recent Activity
      </h2>
      <div className="mt-4 space-y-5">
        {activities.length > 0 ? (
          activities.map((entry, i) => (
            <ActivityItem key={i} entry={entry} />
          ))
        ) : (
          <p className="text-sm text-text-muted">
            No recent activity. Start a job search to see results here.
          </p>
        )}
      </div>
    </div>
  );
}
