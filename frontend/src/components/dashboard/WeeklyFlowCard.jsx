import { ArrowDownRight, ArrowUpRight, WalletCards } from "lucide-react";

export default function WeeklyFlowCard({
  flow,
  hasTransactions,
}) {
  const thisWeek = flow?.thisWeek;

  const credited = thisWeek?.credited || 0;
  const debited = thisWeek?.debited || 0;

  const hasWeeklyActivity =
    thisWeek && (credited > 0 || debited > 0);

  const difference = credited - debited;

  return (
    <div className="min-h-[175px] rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">This week</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Money in vs out
          </p>
        </div>

        {hasWeeklyActivity && (
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
              difference >= 0
                ? "bg-secondary text-secondary-foreground"
                : "bg-accent text-accent-foreground"
            }`}
          >
            {difference >= 0 ? "Surplus" : "Deficit"}
          </span>
        )}
      </div>

      {!hasTransactions ? (
        <div className="flex h-[110px] items-center justify-center text-center">
          <div>
            <WalletCards className="mx-auto h-5 w-5 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              Upload a statement to see your weekly money flow.
            </p>
          </div>
        </div>
      ) : !hasWeeklyActivity ? (
        <div className="flex h-[110px] items-center justify-center text-center">
          <div>
            <p className="text-sm font-medium">
              No activity this week
            </p>
            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
              Your uploaded statement doesn't contain transactions
              from the current 7-day period.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-secondary/20 p-4">
              <div className="flex items-center gap-1.5">
                <ArrowDownRight className="h-4 w-4 text-success" />
                <p className="text-[11px] font-medium text-success">
                  MONEY IN
                </p>
              </div>

              <p className="mt-2 text-xl font-semibold tracking-tight">
                ₹{credited.toLocaleString("en-IN")}
              </p>

              <p className="mt-1 text-[11px] text-muted-foreground">
                Credited this week
              </p>
            </div>

            <div className="rounded-xl border border-border bg-secondary/20 p-4">
              <div className="flex items-center gap-1.5">
                <ArrowUpRight className="h-4 w-4 text-primary" />
                <p className="text-[11px] font-medium text-primary">
                  MONEY OUT
                </p>
              </div>

              <p className="mt-2 text-xl font-semibold tracking-tight">
                ₹{debited.toLocaleString("en-IN")}
              </p>

              <p className="mt-1 text-[11px] text-muted-foreground">
                Debited this week
              </p>
            </div>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            {thisWeek?.message ||
              (difference >= 0
                ? `You have ₹${difference.toLocaleString(
                    "en-IN"
                  )} more coming in than going out.`
                : `You have ₹${Math.abs(difference).toLocaleString(
                    "en-IN"
                  )} more going out than coming in.`)}
          </p>
        </>
      )}
    </div>
  );
}