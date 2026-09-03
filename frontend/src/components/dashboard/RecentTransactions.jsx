import {
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

function formatDate(date) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function RecentTransactions({
  transactions = [],
  hasTransactions,
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">
            Recent transactions
          </h2>

          <p className="mt-0.5 text-xs text-muted-foreground">
            Your latest financial activity
          </p>
        </div>

        <Link
          to="/dashboard/transactions"
          className="flex items-center gap-1 text-xs font-medium text-primary transition hover:opacity-80"
        >
          See all transactions
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {!hasTransactions ? (
        <div className="flex min-h-[150px] flex-col items-center justify-center text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
            <Receipt className="h-5 w-5 text-primary" />
          </div>

          <p className="mt-3 text-sm font-medium">
            No transactions yet
          </p>

          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            Upload a statement to see your recent financial
            activity here.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-4 divide-y divide-border">
            {transactions.slice(0, 5).map((transaction) => {
              const isCredit = transaction.type === "CR";

              return (
                <div
                  key={transaction._id}
                  className="group flex items-center gap-3 py-3"
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                      isCredit
                        ? "bg-secondary"
                        : "bg-secondary"
                    }`}
                  >
                    {isCredit ? (
                      <ArrowDownLeft className="h-4 w-4 text-success" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 text-primary" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {transaction.payee}
                    </p>

                    <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <span>
                        {transaction.category || "Uncategorized"}
                      </span>

                      <span>·</span>

                      <span>
                        {formatDate(transaction.date)}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <p
                      className={`text-sm font-semibold tabular-nums ${
                        isCredit
                          ? "text-success"
                          : "text-foreground"
                      }`}
                    >
                      {isCredit ? "+" : "-"}₹
                      {Number(
                        transaction.amount || 0
                      ).toLocaleString("en-IN")}
                    </p>

                    <Link
                      to="/dashboard/transactions"
                      className="hidden rounded-lg border border-border px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground transition hover:border-primary hover:text-primary sm:block"
                    >
                      Change category
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex justify-end sm:hidden">
            <Link
              to="/dashboard/transactions"
              className="text-xs font-medium text-primary"
            >
              Manage categories →
            </Link>
          </div>
        </>
      )}
    </div>
  );
}