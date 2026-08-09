import {
  Upload,
  Brain,
  Tags,
  LineChart,
  MessageSquare,
  Lightbulb,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Statement",
    desc: "Drop your bank statement in PDF or CSV format.",
  },
  {
    icon: Brain,
    title: "AI Analysis",
    desc: "Every transaction is parsed, cleaned, and analyzed.",
  },
  {
    icon: Tags,
    title: "Smart Categorization",
    desc: "Merchants are automatically matched to categories.",
  },
  {
    icon: LineChart,
    title: "Budget Prediction",
    desc: "Forecasts are created from your spending history.",
  },
  {
    icon: MessageSquare,
    title: "Ask Finwise",
    desc: "Ask questions about your finances in plain English.",
  },
  {
    icon: Lightbulb,
    title: "Financial Insights",
    desc: "Get clear actions and insights worth taking.",
  },
];

const agents = [
  {
    name: "Analysis Agent",
    desc: "Reads transactions line by line and identifies duplicates, refunds, and transfers.",
  },
  {
    name: "Category Agent",
    desc: "Identifies spending categories from merchant names and transaction details.",
  },
  {
    name: "Budget Agent",
    desc: "Predicts future spending and suggests realistic weekly and monthly limits.",
  },
  {
    name: "Q&A Agent",
    desc: "Answers questions using your own transaction and spending data.",
  },
];

export default function Workflow() {
  return (
    <>
      <section
        id="how-it-works"
        className="bg-background py-20 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-sm font-semibold text-primary">
              How Finwise Works
            </p>

            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              From statement to strategy in six steps.
            </h2>

            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              One upload runs the entire pipeline—from transaction analysis
              to personalized financial insights.
            </p>
          </div>

          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <li
                  key={step.title}
                  className="relative"
                >
                  <div className="h-full rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                    <div className="flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </span>

                      <span className="text-xs font-medium tabular-nums text-muted-foreground">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <h3 className="mt-5 text-[15px] font-semibold tracking-tight text-foreground">
                      {step.title}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {step.desc}
                    </p>
                  </div>

                  {index < steps.length - 1 && (
                    <ArrowRight
                      className="absolute -right-3 top-1/2 z-10 hidden h-4 w-4 -translate-y-1/2 text-border lg:block"
                      aria-hidden="true"
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section
        id="agents"
        className="bg-background py-20 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-sm font-semibold text-primary">
              Your AI Finance Team
            </p>

            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Four specialized agents. One coordinated result.
            </h2>

            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Each agent handles a specific financial task, working together
              to turn your transaction data into useful insights.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {agents.map((agent) => (
              <div
                key={agent.name}
                className="group rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="inline-flex items-center rounded-lg bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
                  AI Agent
                </span>

                <h3 className="mt-4 text-[15px] font-semibold tracking-tight text-foreground">
                  {agent.name}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {agent.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}