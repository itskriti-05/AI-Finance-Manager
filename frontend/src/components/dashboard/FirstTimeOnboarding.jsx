import { PieChart, Wallet, MessageCircle, LayoutList, Upload } from "lucide-react";

const benefits = [
  { icon: PieChart, label: "Spending breakdown" },
  { icon: LayoutList, label: "Essential vs discretionary analysis" },
  { icon: Wallet, label: "Personalized budget" },
  { icon: MessageCircle, label: "AI financial Q&A" },
];

const sample = {
  total: 42850,
  essential: 24100,
  discretionary: 18750,
  topCategory: "Food & Dining",
  categories: [
    { label: "Food & Dining", pct: 32 },
    { label: "Rent", pct: 28 },
    { label: "Shopping", pct: 18 },
    { label: "Bills", pct: 14 },
    { label: "Travel", pct: 8 },
  ],
};

export default function FirstTimeOnboarding({ onUploadClick }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card-surface lg:col-span-2 p-5">
          <h2 className="text-base font-semibold">Start your first financial analysis</h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            Upload a PDF or CSV bank statement and Finwise will automatically categorize
            your transactions, identify spending patterns, create a personalized budget,
            and let you ask questions about your finances.
          </p>
          <button
            type="button"
            onClick={onUploadClick}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Upload className="h-4 w-4" />
            Upload Statement
          </button>
          <p className="mt-3 text-[11px] text-muted-foreground">
            PDF or CSV · Secure processing · Your data stays private
          </p>
        </div>

        <div className="card-surface p-5">
          <h2 className="text-sm font-semibold">What you'll get</h2>
          <ul className="mt-3 space-y-2.5">
            {benefits.map((b) => (
              <li key={b.label} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <b.icon className="h-4 w-4 shrink-0 text-primary" />
                {b.label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card-surface p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">See what your analysis will look like</h2>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
            Sample data · February
          </span>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-border bg-secondary/30 p-3">
            <p className="text-[11px] text-muted-foreground">Total spending</p>
            <p className="mt-1 text-base font-semibold">₹{sample.total.toLocaleString("en-IN")}</p>
          </div>
          <div className="rounded-xl border border-border bg-secondary/30 p-3">
            <p className="text-[11px] text-muted-foreground">Essential</p>
            <p className="mt-1 text-base font-semibold">₹{sample.essential.toLocaleString("en-IN")}</p>
          </div>
          <div className="rounded-xl border border-border bg-secondary/30 p-3">
            <p className="text-[11px] text-muted-foreground">Discretionary</p>
            <p className="mt-1 text-base font-semibold">₹{sample.discretionary.toLocaleString("en-IN")}</p>
          </div>
          <div className="rounded-xl border border-border bg-secondary/30 p-3">
            <p className="text-[11px] text-muted-foreground">Top category</p>
            <p className="mt-1 text-base font-semibold">{sample.topCategory}</p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {sample.categories.map((c) => (
            <div key={c.label}>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{c.label}</span>
                <span className="font-medium tabular-nums">{c.pct}%</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-brand-soft" style={{ width: `${c.pct}%` }} />
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-[11px] text-muted-foreground">
          This is sample data for demonstration only - not your actual finances.
        </p>
      </div>
    </div>
  );
}