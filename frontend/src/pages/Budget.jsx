import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  PiggyBank,
  Wallet,
  TrendingDown,
  Target,
  Info,
} from "lucide-react";

import { budgetAPI } from "../api/budget.api";
import PageHeader from "../components/dashboard/PageHeader";

function formatMoney(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function BudgetProgress({ spent, budget }) {
  const percentage = budget > 0 ? Math.round((spent / budget) * 100) : 0;
  const progress = Math.min(percentage, 100);
  const overBudget = spent > budget;

  return (
    <div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            overBudget ? "bg-danger" : "bg-primary"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-1.5 flex justify-between gap-2 text-[11px]">
        <span className="text-muted-foreground">
          {percentage}% used
        </span>

        {overBudget ? (
          <span className="font-medium text-danger">
            {formatMoney(spent - budget)} over
          </span>
        ) : (
          <span className="text-muted-foreground">
            {formatMoney(budget - spent)} remaining
          </span>
        )}
      </div>
    </div>
  );
}

export default function Budget() {
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadBudget = useCallback(async () => {
    setLoading(true);

    try {
      const data = await budgetAPI.get();
      setBudget(data);
    } catch (error) {
      console.error("Failed to load budget:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBudget();
  }, [loadBudget]);

  const categories = budget?.categoryBudgets || [];

  const totalActualSpend = Number(budget?.totalActualSpend || 0);
  const totalSuggestedBudget = Number(
    budget?.totalSuggestedBudget || 0
  );
  const potentialSavings = Number(
    budget?.potentialMonthlySavings || 0
  );

  const overBudgetCategories = useMemo(() => {
    return categories.filter(
      (item) =>
        Number(item.last30DaySpend || 0) >
        Number(item.suggestedMonthlyBudget || 0)
    );
  }, [categories]);

  const essentialCategories = useMemo(() => {
    return categories.filter((item) => item.type === "essential");
  }, [categories]);

  const discretionaryCategories = useMemo(() => {
    return categories.filter(
      (item) => item.type === "discretionary"
    );
  }, [categories]);

  const essentialSpend = essentialCategories.reduce(
    (sum, item) => sum + Number(item.last30DaySpend || 0),
    0
  );

  const discretionarySpend = discretionaryCategories.reduce(
    (sum, item) => sum + Number(item.last30DaySpend || 0),
    0
  );

  const hasData = categories.length > 0;

  return (
    <div className="min-h-full bg-background">

      {/* =========================================
          HEADER
      ========================================= */}

      <PageHeader
        title="Budget"
        subtitle="Understand your spending and plan your monthly budget"
        actions={
          <button
            type="button"
            onClick={loadBudget}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
          >
            Refresh
          </button>
        }
      />

      {loading ? (
        <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
          Loading your budget...
        </div>
      ) : !hasData ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <Wallet className="mx-auto h-8 w-8 text-primary" />

          <p className="mt-3 text-sm font-medium">
            No budget data yet
          </p>

          <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
            Upload a bank statement with spending transactions
            to generate your personalized budget.
          </p>
        </div>
      ) : (
        <>
          {/* =========================================
              SUMMARY CARDS
          ========================================= */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {/* Actual spending */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Actual spending
                  </p>

                  <p className="mt-2 text-2xl font-semibold tracking-tight">
                    {formatMoney(totalActualSpend)}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
              </div>

              <p className="mt-3 text-xs text-muted-foreground">
                Your spending in the last 30 days
              </p>
            </div>

            {/* Suggested budget */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Suggested budget
                  </p>

                  <p className="mt-2 text-2xl font-semibold tracking-tight">
                    {formatMoney(totalSuggestedBudget)}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                  <Target className="h-5 w-5 text-primary" />
                </div>
              </div>

              <p className="mt-3 text-xs text-muted-foreground">
                Based on your last 30 days
              </p>
            </div>

            {/* Potential savings */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Potential savings
                  </p>

                  <p className="mt-2 text-2xl font-semibold tracking-tight">
                    {formatMoney(Math.max(potentialSavings, 0))}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                  <TrendingDown className="h-5 w-5 text-primary" />
                </div>
              </div>

              <p className="mt-3 text-xs text-muted-foreground">
                Possible monthly reduction
              </p>
            </div>

            {/* Over budget */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Over budget
                  </p>

                  <p className="mt-2 text-2xl font-semibold tracking-tight">
                    {overBudgetCategories.length}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                  <ArrowUp className="h-5 w-5 text-danger" />
                </div>
              </div>

              <p className="mt-3 text-xs text-muted-foreground">
                {overBudgetCategories.length === 1
                  ? "category needs attention"
                  : "categories need attention"}
              </p>
            </div>
          </div>

          {/* =========================================
              BUDGET OVERVIEW
          ========================================= */}

          <div className="mt-6 rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold">
                  Monthly budget overview
                </h2>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  Compare your actual spending with the suggested
                  budget
                </p>
              </div>

              <PiggyBank className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="mt-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Spent
                  </p>

                  <p className="mt-1 text-xl font-semibold">
                    {formatMoney(totalActualSpend)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    Suggested limit
                  </p>

                  <p className="mt-1 text-xl font-semibold">
                    {formatMoney(totalSuggestedBudget)}
                  </p>
                </div>
              </div>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-secondary">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    totalActualSpend > totalSuggestedBudget
                      ? "bg-danger"
                      : "bg-primary"
                  }`}
                  style={{
                    width: `${
                      totalSuggestedBudget > 0
                        ? Math.min(
                            (totalActualSpend /
                              totalSuggestedBudget) *
                              100,
                            100
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>

              <div className="mt-2 flex justify-between text-xs">
                <span className="text-muted-foreground">
                  {totalSuggestedBudget > 0
                    ? Math.round(
                        (totalActualSpend /
                          totalSuggestedBudget) *
                          100
                      )
                    : 0}
                  % of suggested budget used
                </span>

                <span
                  className={
                    totalActualSpend > totalSuggestedBudget
                      ? "font-medium text-danger"
                      : "text-muted-foreground"
                  }
                >
                  {totalActualSpend > totalSuggestedBudget
                    ? `${formatMoney(
                        totalActualSpend -
                          totalSuggestedBudget
                      )} over`
                    : `${formatMoney(
                        totalSuggestedBudget -
                          totalActualSpend
                      )} remaining`}
                </span>
              </div>
            </div>
          </div>

          {/* =========================================
              CATEGORY BUDGETS
          ========================================= */}

          <div className="mt-6">
            <div>
              <h2 className="text-sm font-semibold">
                Category budgets
              </h2>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Your spending compared with the suggested amount
                for each category
              </p>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
              {categories.map((item) => {
                const spent = Number(item.last30DaySpend || 0);
                const suggested = Number(
                  item.suggestedMonthlyBudget || 0
                );

                const overBudget = spent > suggested;

                return (
                  <div
                    key={item.category}
                    className="rounded-2xl border border-border bg-card p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate text-sm font-medium">
                            {item.category}
                          </h3>

                          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] capitalize text-muted-foreground">
                            {item.type}
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Last 30 days
                        </p>
                      </div>

                      {overBudget ? (
                        <ArrowUp className="h-4 w-4 shrink-0 text-danger" />
                      ) : (
                        <ArrowDown className="h-4 w-4 shrink-0 text-primary" />
                      )}
                    </div>

                    <div className="mt-5 flex items-end justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold">
                          {formatMoney(spent)}
                        </p>

                        <p className="text-[11px] text-muted-foreground">
                          spent
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {formatMoney(suggested)}
                        </p>

                        <p className="text-[11px] text-muted-foreground">
                          suggested
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <BudgetProgress
                        spent={spent}
                        budget={suggested}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* =========================================
              ESSENTIAL VS DISCRETIONARY
          ========================================= */}

          <div className="mt-6">
            <div>
              <h2 className="text-sm font-semibold">
                Spending type
              </h2>

              <p className="mt-0.5 text-xs text-muted-foreground">
                See how your spending is divided
              </p>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">

              {/* Essential */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Essential
                    </p>

                    <p className="mt-1 text-xl font-semibold">
                      {formatMoney(essentialSpend)}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                    <Wallet className="h-5 w-5 text-primary" />
                  </div>
                </div>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${
                        totalActualSpend > 0
                          ? (essentialSpend /
                              totalActualSpend) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-xs text-muted-foreground">
                  {totalActualSpend > 0
                    ? Math.round(
                        (essentialSpend /
                          totalActualSpend) *
                          100
                      )
                    : 0}
                  % of total spending
                </p>
              </div>

              {/* Discretionary */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Discretionary
                    </p>

                    <p className="mt-1 text-xl font-semibold">
                      {formatMoney(discretionarySpend)}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                    <TrendingDown className="h-5 w-5 text-primary" />
                  </div>
                </div>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${
                        totalActualSpend > 0
                          ? (discretionarySpend /
                              totalActualSpend) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-xs text-muted-foreground">
                  {totalActualSpend > 0
                    ? Math.round(
                        (discretionarySpend /
                          totalActualSpend) *
                          100
                      )
                    : 0}
                  % of total spending
                </p>
              </div>
            </div>
          </div>

          {/* =========================================
              EXISTING SAVINGS
          ========================================= */}

          {budget?.existingSavings && (
            <div className="mt-6 rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
                  <PiggyBank className="h-5 w-5 text-primary" />
                </div>

                <div className="min-w-0">
                  <h2 className="text-sm font-semibold">
                    Savings already set aside
                  </h2>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Savings transactions detected in your last
                    30 days
                  </p>

                  <p className="mt-3 text-xl font-semibold">
                    {formatMoney(
                      budget.existingSavings.total
                    )}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {budget.existingSavings.transactionCount}{" "}
                    transaction
                    {budget.existingSavings.transactionCount ===
                    1
                      ? ""
                      : "s"}
                  </p>

                  {budget.existingSavings.message && (
                    <div className="mt-3 flex items-start gap-2 rounded-xl bg-secondary p-3">
                      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />

                      <p className="text-xs text-muted-foreground">
                        {budget.existingSavings.message}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* =========================================
              EXPLANATION
          ========================================= */}

          <div className="mt-6 rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary">
                <Info className="h-4 w-4 text-primary" />
              </div>

              <div>
                <h2 className="text-sm font-semibold">
                  How your budget works
                </h2>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Finwise looks at your spending from the last
                  30 days. Essential expenses keep their current
                  spending level as the suggested budget, while
                  discretionary categories are given a suggested
                  budget of 85% of recent spending.
                </p>

                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  This is a planning suggestion based on your
                  transaction history, not a fixed financial
                  limit. You can use it to identify categories
                  where reducing spending may help you save more.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}