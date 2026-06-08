import { JobsOverTimeChart, type ChartDatum } from "./JobsOverTimeChart";
import { MatchScoreDistributionChart } from "./MatchScoreDistributionChart";
import { CompanyResearchChart } from "./CompanyResearchChart";

type Props = {
  jobsOverTime: ChartDatum[];
  matchScoreDistribution: ChartDatum[];
  companyResearch: ChartDatum[];
};

function chartCard(title: string, chart: React.ReactNode) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <h3 className="text-base font-semibold leading-6 text-text-primary">
        {title}
      </h3>
      <div className="mt-3 flex justify-center">{chart}</div>
    </div>
  );
}

export function AnalyticsCharts({
  jobsOverTime,
  matchScoreDistribution,
  companyResearch,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {chartCard("Jobs Found Over Time", <JobsOverTimeChart data={jobsOverTime} />)}
      {chartCard("Match Score Distribution", <MatchScoreDistributionChart data={matchScoreDistribution} />)}
      {chartCard("Company Research Activity", <CompanyResearchChart data={companyResearch} />)}
    </div>
  );
}
