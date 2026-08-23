import { ArrowUpRight, Wallet } from "lucide-react";

export default function BudgetPlanner({
  categoryBudgets,
  hasTransactions,
}) {
  const categories = categoryBudgets?.slice(0, 3) || [];

  return (
   <div className="h-full min-h-[250px] rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">
            Budget planner
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Based on your last 30 days
          </p>
        </div>

        <Wallet className="h-4 w-4 text-muted-foreground" />
      </div>

      {!hasTransactions || categories.length === 0 ? (
        <div className="flex h-[125px] items-center justify-center text-center">
          <p className="max-w-xs text-sm text-muted-foreground">
            Your personalized budget will appear after your
            spending is analyzed.
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          {categories.map((item) => {
            const spent = item.last30DaySpend || 0;
            const budget = item.suggestedMonthlyBudget || 0;

            const percentage =
              budget > 0
                ? Math.round((spent / budget) * 100)
                : 0;

            const progress = Math.min(percentage, 100);
            const overBudget = spent > budget;

            return (
              <div key={item.category}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="truncate text-xs font-medium">
                      {item.category}
                    </span>

                    {overBudget && (
                      <ArrowUpRight className="h-3 w-3 shrink-0 text-danger" />
                    )}
                  </div>

                  <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
                    ₹{spent.toLocaleString("en-IN")} / ₹
                    {budget.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className={`h-full rounded-full transition-all ${
                      overBudget ? "bg-danger" : "bg-primary"
                    }`}
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>

                <div className="mt-1 flex justify-between">
                  <span className="text-[10px] text-muted-foreground">
                    {percentage}% used
                  </span>

                  {overBudget ? (
                    <span className="text-[10px] font-medium text-danger">
                      Over budget
                    </span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">
                      ₹{(budget - spent).toLocaleString("en-IN")} remaining
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}