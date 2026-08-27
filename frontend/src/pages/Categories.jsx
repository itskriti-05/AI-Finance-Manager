import { useCallback, useEffect, useMemo, useState } from "react";
import {
  PieChart,
  RefreshCw,
  Wallet,
  ArrowUpRight,
  Utensils,
  ShoppingBag,
  Home,
  Plane,
  Receipt,
  Smartphone,
  MoreHorizontal,
} from "lucide-react";

import { budgetAPI } from "../api/budget.api";
import { transactionAPI } from "../api/transaction.api";
import PageHeader from "../components/dashboard/PageHeader";

const CATEGORY_ICONS = {
  Food: Utensils,
  Shopping: ShoppingBag,
  Rent: Home,
  Travel: Plane,
  Bills: Receipt,
  Groceries: ShoppingBag,
  Electronics: Smartphone,
};

function formatMoney(amount) {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
}

function getCategoryIcon(category) {
  return CATEGORY_ICONS[category] || MoreHorizontal;
}

export default function Categories() {
  const [categoryBudgets, setCategoryBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [budgetData, transactionData] = await Promise.all([
        budgetAPI.get(),
        transactionAPI.list(100),
      ]);

      setCategoryBudgets(budgetData?.categoryBudgets || []);
      setTransactions(transactionData?.transactions || []);
    } catch (err) {
      console.error("Failed to load category data:", err);

      setError(
        "We couldn't load your category data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /*
   * Transaction endpoint is only being used for counts.
   * Financial spending amounts come from budgetAPI,
   * which uses the backend's existing 30-day calculation.
   */
  const transactionCounts = useMemo(() => {
    const counts = {};

    transactions.forEach((transaction) => {
      const category = transaction.category || "Uncategorized";

      counts[category] = (counts[category] || 0) + 1;
    });

    return counts;
  }, [transactions]);

  const totalSpending = useMemo(() => {
    return categoryBudgets.reduce(
      (total, item) => total + Number(item.last30DaySpend || 0),
      0
    );
  }, [categoryBudgets]);

  const topCategory = categoryBudgets[0];

  const discretionarySpending = useMemo(() => {
    return categoryBudgets
      .filter((item) => item.type === "discretionary")
      .reduce(
        (total, item) =>
          total + Number(item.last30DaySpend || 0),
        0
      );
  }, [categoryBudgets]);

  const essentialSpending = useMemo(() => {
    return categoryBudgets
      .filter((item) => item.type === "essential")
      .reduce(
        (total, item) =>
          total + Number(item.last30DaySpend || 0),
        0
      );
  }, [categoryBudgets]);

  const hasData = categoryBudgets.length > 0;

  return (
    <div className="min-h-full bg-background">
      <PageHeader
        title="Categories"
        subtitle="Understand where your money is going"
        actions={
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                loading ? "animate-spin" : ""
              }`}
            />

            Refresh
          </button>
        }
      />

      {/* ERROR */}
      {error && (
        <div className="mb-5 rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-danger">{error}</p>

          <button
            type="button"
            onClick={loadData}
            className="mt-2 text-xs font-medium text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <RefreshCw className="mx-auto h-5 w-5 animate-spin text-primary" />

            <p className="mt-3 text-sm text-muted-foreground">
              Analyzing your spending...
            </p>
          </div>
        </div>
      ) : !hasData ? (
        /* EMPTY STATE */
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
            <PieChart className="h-5 w-5 text-primary" />
          </div>

          <h2 className="mt-4 text-base font-semibold">
            No spending categories yet
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Upload a bank statement and Finwise will organize
            your spending into categories automatically.
          </p>
        </div>
      ) : (
        <>
          {/* =========================================
              SUMMARY
          ========================================= */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* TOTAL SPENDING */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Total spending
                  </p>

                  <p className="mt-2 text-2xl font-semibold tracking-tight">
                    {formatMoney(totalSpending)}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
              </div>

              <p className="mt-3 text-xs text-muted-foreground">
                Across your categories · Last 30 days
              </p>
            </div>

            {/* TOP CATEGORY */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Highest spending
                  </p>

                  <p className="mt-2 text-xl font-semibold">
                    {topCategory?.category || "—"}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                  <PieChart className="h-5 w-5 text-primary" />
                </div>
              </div>

              <p className="mt-3 text-xs text-muted-foreground">
                {formatMoney(topCategory?.last30DaySpend)} spent
              </p>
            </div>

            {/* CATEGORY COUNT */}
            <div className="rounded-2xl border border-border bg-card p-5 sm:col-span-2 lg:col-span-1">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Active categories
                  </p>

                  <p className="mt-2 text-2xl font-semibold">
                    {categoryBudgets.length}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                  <Receipt className="h-5 w-5 text-primary" />
                </div>
              </div>

              <p className="mt-3 text-xs text-muted-foreground">
                Categories with spending in the last 30 days
              </p>
            </div>
          </div>

          {/* =========================================
              SPENDING DISTRIBUTION
          ========================================= */}

         {/* =========================================
    SPENDING DISTRIBUTION
========================================= */}

<div className="mt-6 rounded-2xl border border-border bg-card p-5">
  {/* Header */}
  <div className="flex items-start justify-between">
    <div>
      <h2 className="text-sm font-semibold">
        Spending distribution
      </h2>

      <p className="mt-0.5 text-xs text-muted-foreground">
        Where your money went in the last 30 days
      </p>
    </div>

    <PieChart className="h-4 w-4 text-muted-foreground" />
  </div>

  <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
    
    {/* DONUT */}
    <div className="flex flex-col items-center justify-center">
      <div className="relative h-52 w-52 sm:h-56 sm:w-56">
        
        {/* Donut */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: (() => {
              let accumulated = 0;

              const stops = categoryBudgets
                .map((item, index) => {
                  const spent = Number(item.last30DaySpend || 0);

                  const percentage =
                    totalSpending > 0
                      ? (spent / totalSpending) * 100
                      : 0;

                  const start = accumulated;
                  accumulated += percentage;

                  const opacity =
                    Math.max(25, 100 - index * 14) / 100;

                  return `color-mix(
                    in oklab,
                    var(--color-primary) ${Math.round(
                      opacity * 100
                    )}%,
                    transparent
                  ) ${start}% ${accumulated}%`;
                })
                .join(", ");

              return stops
                ? `conic-gradient(${stops})`
                : "var(--color-secondary)";
            })(),

            mask:
              "radial-gradient(circle, transparent 58%, black 59%)",

            WebkitMask:
              "radial-gradient(circle, transparent 58%, black 59%)",
          }}
        />

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[11px] text-muted-foreground">
            Total spending
          </span>

          <span className="mt-1 text-xl font-semibold tracking-tight">
            {formatMoney(totalSpending)}
          </span>

          <span className="mt-0.5 text-[11px] text-muted-foreground">
            last 30 days
          </span>
        </div>
      </div>

      {/* Largest category */}
      {topCategory && (
        <div className="mt-4 text-center">
          <p className="text-[11px] text-muted-foreground">
            Highest spending
          </p>

          <p className="mt-1 text-sm font-medium">
            {topCategory.category}
          </p>

          <p className="text-xs text-muted-foreground">
            {formatMoney(topCategory.last30DaySpend)}
          </p>
        </div>
      )}
    </div>

    {/* CATEGORY LIST */}
    <div className="space-y-2">
      {categoryBudgets.map((item, index) => {
        const spent = Number(item.last30DaySpend || 0);

        const percentage =
          totalSpending > 0
            ? Math.round((spent / totalSpending) * 100)
            : 0;

        const Icon = getCategoryIcon(item.category);

        const transactionCount =
          transactionCounts[item.category] || 0;

        const opacity =
          Math.max(25, 100 - index * 14);

        return (
          <div
            key={item.category}
            className="rounded-xl p-3 transition-colors hover:bg-secondary/50"
          >
            <div className="flex items-center gap-3">
              
              {/* Icon */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
                <Icon className="h-4 w-4 text-primary" />
              </div>

              {/* Category information */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="block truncate text-sm font-medium">
                      {item.category}
                    </span>

                    <span className="text-[11px] text-muted-foreground">
                      {transactionCount} transaction
                      {transactionCount === 1 ? "" : "s"}
                    </span>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-sm font-medium tabular-nums">
                      {formatMoney(spent)}
                    </p>

                    <p className="text-[11px] text-muted-foreground">
                      {percentage}%
                    </p>
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      background:
                        `color-mix(in oklab, var(--color-primary) ${opacity}%, transparent)`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
</div>

          {/* =========================================
              ESSENTIAL VS DISCRETIONARY
          ========================================= */}

          <div className="mt-6">
            <div className="mb-4">
              <h2 className="text-sm font-semibold">
                Spending type
              </h2>

              <p className="mt-0.5 text-xs text-muted-foreground">
                A simple view of essential and discretionary spending
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* ESSENTIAL */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Essential
                    </p>

                    <p className="mt-2 text-xl font-semibold">
                      {formatMoney(essentialSpending)}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                    <Home className="h-4 w-4 text-primary" />
                  </div>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${
                        totalSpending > 0
                          ? Math.min(
                              (essentialSpending /
                                totalSpending) *
                                100,
                              100
                            )
                          : 0
                      }%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-xs text-muted-foreground">
                  {totalSpending > 0
                    ? Math.round(
                        (essentialSpending /
                          totalSpending) *
                          100
                      )
                    : 0}
                  % of total spending
                </p>
              </div>

              {/* DISCRETIONARY */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Discretionary
                    </p>

                    <p className="mt-2 text-xl font-semibold">
                      {formatMoney(discretionarySpending)}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                    <ShoppingBag className="h-4 w-4 text-primary" />
                  </div>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${
                        totalSpending > 0
                          ? Math.min(
                              (discretionarySpending /
                                totalSpending) *
                                100,
                              100
                            )
                          : 0
                      }%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-xs text-muted-foreground">
                  {totalSpending > 0
                    ? Math.round(
                        (discretionarySpending /
                          totalSpending) *
                          100
                      )
                    : 0}
                  % of total spending
                </p>
              </div>
            </div>
          </div>

          {/* =========================================
              CATEGORY DETAILS
          ========================================= */}

          <div className="mt-6">
            <div className="mb-4">
              <h2 className="text-sm font-semibold">
                Category details
              </h2>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Your spending grouped by category
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="hidden grid-cols-[1fr_150px_150px_130px] border-b border-border px-5 py-3 text-xs text-muted-foreground sm:grid">
                <span>Category</span>
                <span>Type</span>
                <span>Transactions</span>
                <span className="text-right">
                  Spending
                </span>
              </div>

              <div className="divide-y divide-border">
                {categoryBudgets.map((item) => {
                  const Icon = getCategoryIcon(
                    item.category
                  );

                  return (
                    <div
                      key={item.category}
                      className="grid grid-cols-1 gap-3 px-5 py-4 sm:grid-cols-[1fr_150px_150px_130px] sm:items-center"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>

                        <div>
                          <p className="text-sm font-medium">
                            {item.category}
                          </p>

                          <p className="text-[11px] text-muted-foreground sm:hidden">
                            {item.type === "essential"
                              ? "Essential"
                              : "Discretionary"}{" "}
                            ·{" "}
                            {transactionCounts[
                              item.category
                            ] || 0}{" "}
                            transaction
                            {transactionCounts[
                              item.category
                            ] === 1
                              ? ""
                              : "s"}
                          </p>
                        </div>
                      </div>

                      <span className="hidden text-xs text-muted-foreground sm:block">
                        {item.type === "essential"
                          ? "Essential"
                          : "Discretionary"}
                      </span>

                      <span className="hidden text-xs text-muted-foreground sm:block">
                        {transactionCounts[
                          item.category
                        ] || 0}{" "}
                        transaction
                        {transactionCounts[
                          item.category
                        ] === 1
                          ? ""
                          : "s"}
                      </span>

                      <span className="text-sm font-semibold tabular-nums sm:text-right">
                        {formatMoney(
                          item.last30DaySpend
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SMALL EXPLANATION */}
          <div className="mt-6 rounded-2xl border border-border bg-card p-5">
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary">
                <ArrowUpRight className="h-4 w-4 text-primary" />
              </div>

              <div>
                <h3 className="text-sm font-medium">
                  How categories work
                </h3>

                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Finwise automatically categorizes transactions
                  when your statement is uploaded. If a category
                  is incorrect, you can change it from the
                  Transactions page. Your dashboard and category
                  analysis will then use the updated category.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}