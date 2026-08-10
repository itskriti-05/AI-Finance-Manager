import { Link } from "react-router-dom";
import { Sparkles, LineChart, ShieldCheck } from "lucide-react";

const points = [
  {
    icon: Sparkles,
    title: "AI that reads your statements",
    body: "Upload a PDF or CSV and get clean, categorized transactions in seconds.",
  },
  {
    icon: LineChart,
    title: "Budgets that adapt",
    body: "Finwise learns your spending rhythm and adjusts limits every month.",
  },
  {
    icon: ShieldCheck,
    title: "Private by default",
    body: "Your data stays encrypted and is never sold or shared.",
  },
];

export default function AuthSidePanel() {
  return (
    <div className="hidden h-full flex-col justify-between bg-secondary p-10 lg:flex lg:p-14">
      <Link to="/" className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
          F
        </span>
        <span className="text-[15px] font-semibold tracking-tight">Finwise</span>
      </Link>

      <div className="max-w-sm">
        <h2 className="text-xl font-semibold leading-tight tracking-tight text-foreground">
          Everything your statement is hiding, made obvious.
        </h2>

        <ul className="mt-8 space-y-6">
          {points.map((p) => (
            <li key={p.title} className="flex gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background text-primary">
                <p.icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[12px] font-semibold text-foreground">{p.title}</p>
                <p className="mt-0.5 text-[10px] leading-relaxed text-muted-foreground">
                  {p.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-muted-foreground">
        © {new Date().getFullYear()} Finwise. All rights reserved.
      </p>
    </div>
  );
}