import { PieChart } from "lucide-react";

export default function CategoryBreakdown({
  categoryBudgets,
  hasTransactions,
}) {
  const categories = categoryBudgets?.slice(0, 5) || [];

  const total = categories.reduce(
    (sum, item) => sum + (item.last30DaySpend || 0),
    0
  );

  const colors = [
    "var(--color-primary)",
    "color-mix(in oklab, var(--color-primary) 70%, transparent)",
    "color-mix(in oklab, var(--color-primary) 50%, transparent)",
    "color-mix(in oklab, var(--color-primary) 30%, transparent)",
    "color-mix(in oklab, var(--color-primary) 15%, transparent)",
  ];

  let accumulated = 0;

  const gradientStops = categories.map((item, index) => {
    const percentage =
      total > 0
        ? ((item.last30DaySpend || 0) / total) * 100
        : 0;

    const start = accumulated;
    accumulated += percentage;

    return `${colors[index]} ${start}% ${accumulated}%`;
  });

  return (
    <div className="h-full min-h-[250px] rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">
            Category breakdown
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Last 30 days
          </p>
        </div>

        <PieChart className="h-4 w-4 text-muted-foreground" />
      </div>

      {!hasTransactions || categories.length === 0 ? (
        <div className="flex h-[125px] items-center justify-center text-center">
          <p className="max-w-xs text-sm text-muted-foreground">
            Your spending categories will appear here once your
            statement is analyzed.
          </p>
        </div>
      ) : (
        <div className="mt-5 flex items-center gap-5">
          <div
            className="relative h-28 w-28 shrink-0 rounded-full"
            style={{
              background:
                gradientStops.length > 0
                  ? `conic-gradient(${gradientStops.join(", ")})`
                  : "var(--color-secondary)",
              mask:
                "radial-gradient(circle, transparent 56%, black 57%)",
              WebkitMask:
                "radial-gradient(circle, transparent 56%, black 57%)",
            }}
            aria-hidden="true"
          />

          <div className="min-w-0 flex-1 space-y-2">
            {categories.map((item, index) => {
              const percentage =
                total > 0
                  ? ((item.last30DaySpend / total) * 100).toFixed(0)
                  : 0;

              return (
                <div
                  key={item.category}
                  className="flex items-center gap-2"
                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{
                      background: colors[index],
                    }}
                  />

                  <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
                    {item.category}
                  </span>

                  <span className="text-xs font-medium tabular-nums">
                    {percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}