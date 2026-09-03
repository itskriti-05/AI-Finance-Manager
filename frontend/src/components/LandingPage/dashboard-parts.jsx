import { Sparkles, TrendingDown, TrendingUp } from "lucide-react";

const bars = [
  { m: "Jan", v: 52 },
  { m: "Feb", v: 68 },
  { m: "Mar", v: 44 },
  { m: "Apr", v: 81 },
  { m: "May", v: 63 },
  { m: "Jun", v: 92 },
  { m: "Jul", v: 74 },
];

export function ExpenseChart({ compact = false }) {
  return (
    <div className="card-surface p-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] text-muted-foreground">Monthly spending</p>
          <p className="mt-0.5 text-base font-semibold tracking-tight">₹84,320</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-medium text-accent-foreground">
          <TrendingDown className="h-3 w-3" /> 6.2%
        </span>
      </div>
      <div className="mt-2.5 flex items-end gap-1.5" aria-hidden="true">
        {bars.map((b, i) => (
          <div key={b.m} className="flex flex-1 flex-col items-center justify-end gap-1">
            <div
              className={`w-full rounded-md ${i === bars.length - 2 ? "bg-primary" : "bg-brand-soft"}`}
              style={{ height: `${Math.round((b.v / 100) * (compact ? 40 : 96))}px` }}
            />
            <span className="text-[9px] text-muted-foreground">{b.m}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const slices = [
  { label: "Food", pct: 34, color: "var(--color-primary)" },
  { label: "Shopping", pct: 26, color: "color-mix(in oklab, var(--color-primary) 60%, transparent)" },
  { label: "Travel", pct: 22, color: "color-mix(in oklab, var(--color-primary) 35%, transparent)" },
  { label: "Bills", pct: 18, color: "color-mix(in oklab, var(--color-primary) 18%, transparent)" },
];

export function CategoryPie() {
  let acc = 0;
  const stops = slices
    .map((s) => {
      const start = acc;
      acc += s.pct;
      return `${s.color} ${start}% ${acc}%`;
    })
    .join(", ");

  return (
    <div className="card-surface flex h-full flex-col justify-center p-3">
      <p className="text-[11px] text-muted-foreground">By category</p>
      <div className="mt-2 flex items-center gap-3">
        <div
          className="h-12 w-12 shrink-0 rounded-full"
          style={{
            background: `conic-gradient(${stops})`,
            mask: "radial-gradient(circle, transparent 52%, black 53%)",
            WebkitMask: "radial-gradient(circle, transparent 52%, black 53%)",
          }}
          aria-hidden="true"
        />
        <ul className="flex-1 space-y-1">
          {slices.map((s) => (
            <li key={s.label} className="flex items-center gap-2 text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.color }} aria-hidden="true" />
              <span className="flex-1 text-muted-foreground">{s.label}</span>
              <span className="font-medium tabular-nums">{s.pct}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const budgets = [
  { label: "Food & Dining", used: 72, amt: "₹14,400 / ₹20,000" },
  { label: "Shopping", used: 45, amt: "₹6,750 / ₹15,000" },
  { label: "Transport", used: 88, amt: "₹5,280 / ₹6,000" },
];

export function BudgetCard() {
  return (
    <div className="card-surface p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Budget planner</p>
        <span className="text-[11px] text-muted-foreground">August</span>
      </div>
      <div className="mt-4 space-y-3.5">
        {budgets.map((b) => (
          <div key={b.label}>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{b.label}</span>
              <span className="tabular-nums font-medium">{b.amt}</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${b.used}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function InsightCard() {
  return (
    <div className="card-surface bg-accent p-4">
      <div className="flex items-center gap-2 text-accent-foreground">
        <Sparkles className="h-4 w-4" />
        <p className="text-sm font-medium">AI Insight</p>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-accent-foreground/90">
        Your dining spend rose <strong>12%</strong> vs. your 3-month average. Trim two
        weekend orders to stay on budget.
      </p>
    </div>
  );
}

const txns = [
  { name: "Swiggy", cat: "Food", amt: "-₹482", when: "Today" },
  { name: "Amazon", cat: "Shopping", amt: "-₹2,199", when: "Yesterday" },
  { name: "Uber", cat: "Transport", amt: "-₹238", when: "Aug 4" },
  { name: "Salary", cat: "Income", amt: "+₹1,20,000", when: "Aug 1" },
];

export function TransactionsCard({ rows = txns, limit }) {
  const visible = limit ? rows.slice(0, limit) : rows;
  return (
    <div className="card-surface p-3.5">
      <p className="text-sm font-medium">Recent transactions</p>
      <ul className="mt-2 divide-y divide-border">
        {visible.map((t) => (
          <li key={t.name} className="flex items-center gap-3 py-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-xs font-semibold text-secondary-foreground">
              {t.name.slice(0, 1)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{t.name}</p>
              <p className="text-[11px] text-muted-foreground">
                {t.cat} · {t.when}
              </p>
            </div>
            <span
              className={`shrink-0 text-sm font-medium tabular-nums ${t.amt.startsWith("+") ? "text-success" : ""}`}
            >
              {t.amt}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function StatStrip() {
  const stats = [
    { l: "Income", v: "₹1,20,000", up: true },
    { l: "Expenses", v: "₹84,320", up: false },
    { l: "Saved", v: "₹35,680", up: true },
  ];
  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((s) => (
        <div key={s.l} className="card-surface p-3">
          <p className="text-[11px] text-muted-foreground">{s.l}</p>
          <p className="mt-1 text-sm font-semibold tracking-tight">{s.v}</p>
          <span
            className={`mt-1 inline-flex items-center gap-1 text-[10px] ${s.up ? "text-success" : "text-muted-foreground"}`}
          >
            {s.up ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            vs last month
          </span>
        </div>
      ))}
    </div>
  );
}

export function ChatCard() {
  return (
    <div className="card-surface flex flex-col gap-3 p-4">
      <p className="text-sm font-medium">Ask Finwise</p>
      <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-primary px-3 py-2 text-xs text-primary-foreground">
        How much did I spend on Food last month?
      </div>
      <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-secondary px-3 py-2 text-xs text-secondary-foreground">
        <strong>₹12,480</strong> on Food last month.
      </div>
      <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-primary px-3 py-2 text-xs text-primary-foreground">
        How much did I spend on Electronics?
      </div>
      <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-secondary px-3 py-2 text-xs text-secondary-foreground">
        <strong>₹8,900</strong> — 3 purchases.
      </div>
      <div className="mt-1 flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs text-muted-foreground">
        Ask about any merchant, month or category…
      </div>
    </div>
  );
}