import {
  BudgetCard,
  CategoryPie,
  ChatCard,
  ExpenseChart,
  TransactionsCard,
} from "./dashboard-parts";

function Row({
  eyebrow,
  title,
  body,
  bullets,
  visual,
  flip,
}) {
  return (
    <div className="grid items-center gap-10 py-14 lg:grid-cols-2 lg:gap-16">
      <div className={flip ? "lg:order-2" : ""}>
        <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-primary">
          {eyebrow}
        </p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h3>
        <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
          {body}
        </p>
        {bullets && (
          <ul className="mt-5 space-y-2">
            {bullets.map((b) => (
              <li key={b} className="flex gap-2 text-sm text-muted-foreground">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                {b}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className={flip ? "lg:order-1" : ""}>
        <div className="flex w-full flex-col justify-center rounded-2xl border border-border bg-secondary/40 p-3">
          {visual}
        </div>
      </div>
    </div>
  );
}

const merchants = [
  { name: "Amazon", cat: "Shopping", amt: "-₹2,199", when: "Aug 6" },
  { name: "Swiggy", cat: "Food", amt: "-₹482", when: "Aug 6" },
  { name: "Uber", cat: "Transport", amt: "-₹238", when: "Aug 5" },
  { name: "Zomato", cat: "Food", amt: "-₹656", when: "Aug 4" },
];

function CategoryTable() {
  const rows = [
    { m: "MYNTRA*ORDER 8821", cat: "Shopping", state: "Confirmed" },
    { m: "RZP*SWIGGY BLR", cat: "Food & Dining", state: "Confirmed" },
    { m: "PAYTM*QR 99213", cat: "Uncategorized", state: "Needs review" },
    { m: "IRCTC WEB", cat: "Travel", state: "Confirmed" },
  ];
  return (
    <div className="card-surface overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <p className="text-sm font-medium">Category manager</p>
        <span className="rounded-md bg-secondary px-2 py-1 text-[11px] text-secondary-foreground">
          4 merchants
        </span>
      </div>
      <table className="w-full text-left text-xs">
        <thead className="text-muted-foreground">
          <tr>
            <th className="px-4 py-2 font-medium">Merchant</th>
            <th className="px-4 py-2 font-medium">Category</th>
            <th className="px-4 py-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.m} className="border-t border-border">
              <td className="px-4 py-3 font-medium">{r.m}</td>
              <td className="px-4 py-3">
                <span className="rounded-md border border-border px-2 py-1">{r.cat}</span>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-md px-2 py-1 ${
                    r.state === "Confirmed"
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-accent text-accent-foreground"
                  }`}
                >
                  {r.state}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Features() {
  return (
    <section id="features" className="border-b border-border overflow-x-hidden">
      <div className="mx-auto max-w-6xl px-5 py-16 lg:py-24">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Everything your statement is hiding, made obvious.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
            Four capabilities that turn a raw PDF into a working financial picture.
          </p>
        </div>

        <div className="divide-y divide-border">
          <Row
            eyebrow="Feature 01"
            title="Transaction Analysis"
            body="AI automatically identifies merchants like Amazon, Swiggy, Uber, Zomato and Myntra and categorizes expenses accurately — no rules to write, no spreadsheets to maintain."
            visual={
              <div className="space-y-3">
                <ExpenseChart />
                <TransactionsCard rows={merchants} />
              </div>
            }
          />
          <Row
            eyebrow="Feature 02"
            title="Budget Planner"
            body="Receive intelligent weekly and monthly spending recommendations based on your financial history, with live tracking against every category."
            flip
            visual={
              <div className="space-y-3">
                <BudgetCard />
                <CategoryPie />
              </div>
            }
          />
          <Row
            eyebrow="Feature 03"
            title="AI Chat"
            body="Ask natural language questions and get grounded answers from your own transactions."
            bullets={[
              "How much did I spend on Food last week?",
              "Which category increased the most?",
              "Show my shopping expenses.",
            ]}
            visual={<ChatCard />}
          />
          <Row
            eyebrow="Feature 04"
            title="Category Management"
            body="Correct an unknown merchant once and Finwise remembers it for every future statement you upload."
            flip
            visual={<CategoryTable />}
          />
        </div>
      </div>
    </section>
  );
}