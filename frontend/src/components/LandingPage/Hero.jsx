import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Lock,
  Wallet,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  BudgetCard,
  CategoryPie,
  ExpenseChart,
  StatStrip,
  TransactionsCard,
} from "./dashboard-parts";

const trust = [
  {
    icon: ShieldCheck,
    label: "Secure PDF & CSV Upload",
  },
  {
    icon: Sparkles,
    label: "AI Powered Categorization",
  },
  {
    icon: Wallet,
    label: "Personalized Budgeting",
  },
  {
    icon: Lock,
    label: "Private & Encrypted",
  },
];

export default function Hero() {
  return (
    <section
      id="top"
      className="w-full overflow-x-hidden overflow-hidden bg-background"
    >
    

      <div
        className="
          mx-auto
          grid
          w-full
          max-w-6xl
          min-w-0
          items-center
          gap-12
          px-5
          py-12
          sm:px-6
          sm:py-16
          lg:grid-cols-2
          lg:gap-12
          lg:px-8
          lg:py-20
        "
      >
       

        <div className="min-w-0 w-full">

          <div className="mb-6 inline-flex max-w-full items-center rounded-full border border-border bg-secondary/40 px-3 py-1.5">
            <span className="truncate text-xs font-medium text-muted-foreground">
              Now with multi-agent statement analysis
            </span>
          </div>


          <h1
            className="
              w-full
              max-w-full
              wrap:anywhere]
              text-3xl
              font-semibold
              leading-[1.12]
              tracking-tight
              text-foreground
              sm:text-5xl
              lg:text-[52px]
            "
          >
            Your Personal AI Finance Manager That Understands Your Spending.
          </h1>


          <p
            className="
              mt-5
              w-full
              max-w-lg
              wrap-break-wordbreak-words
              text-[15px]
              leading-relaxed
              text-muted-foreground
              sm:text-base
            "
          >
            Upload your bank statement and let AI automatically categorize
            transactions, generate personalized budgets, analyze spending
            habits, and answer financial questions—all in one secure platform.
          </p>

        
          <div
            className="
              mt-7
              flex
              w-full
              flex-col
              items-stretch
              gap-3
              sm:w-auto
              sm:flex-row
              sm:items-center
            "
          >
            <Link
              to="/signup"
              className="
                group
                inline-flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-primary
                px-6
                py-3.5
                text-sm
                font-medium
                text-primary-foreground
                transition-opacity
                hover:opacity-90
                sm:w-auto
              "
            >
              Get Started

              <ArrowRight
                className="
                  h-4
                  w-4
                  transition-transform
                  duration-200
                  group-hover:translate-x-0.5
                "
              />
            </Link>

            <span className="text-center text-xs text-muted-foreground sm:text-left">
              Free to start · No card required
            </span>
          </div>
        </div>

   

        <div
          className="
            relative
            mx-auto
            mt-8
            min-w-0
            w-full
            max-w-[480px]
            lg:mt-0
            lg:ml-auto
            lg:mr-0
          "
        >
          <div className="w-full rounded-2xl border border-border bg-secondary/40 p-2 shadow-lift">
            <div className="w-full min-w-0 rounded-xl border border-border bg-background p-3">

              <div className="mb-2.5 flex min-w-0 items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold tracking-tight">
                    Overview
                  </p>

                  <p className="truncate text-[10px] text-muted-foreground">
                    hdfc-statement-aug.pdf · analyzed
                  </p>
                </div>

                <div className="flex shrink-0 gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-border" />
                  <span className="h-1.5 w-1.5 rounded-full bg-border" />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                </div>
              </div>


              <div className="min-w-0 space-y-2">
                <StatStrip />

                <div className="grid min-w-0 gap-2 sm:grid-cols-2">
                  <ExpenseChart compact />
                  <CategoryPie />
                </div>

                <div className="grid min-w-0 gap-2 sm:grid-cols-2">
                  <BudgetCard />
                  <TransactionsCard limit={3} />
                </div>
              </div>
            </div>
          </div>

         
          <div
            className="
              absolute
              -bottom-5
              left-2
              w-[calc(100%-16px)]
              max-w-52
              rounded-xl
              border
              border-border
              bg-card
              p-3
              shadow-lift
              sm:-left-8
            "
          >
            <p className="text-xs font-medium">
              💡 AI Insight
            </p>

            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              You spent{" "}
              <span className="font-semibold text-foreground">
                18% less
              </span>{" "}
              on Shopping this month.
            </p>
          </div>
        </div>
      </div>

      

      <div className="mx-auto w-full max-w-6xl px-5 pb-8 sm:px-6 lg:px-8">
        <ul
          className="
            flex
            flex-wrap
            items-center
            justify-center
            gap-x-5
            gap-y-3
            border-t
            border-border
            pt-6
            sm:gap-x-8
          "
        >
          {trust.map((item) => {
            const Icon = item.icon;

            return (
              <li
                key={item.label}
                className="
                  inline-flex
                  items-center
                  gap-2
                  text-center
                  text-[11px]
                  text-muted-foreground
                  sm:text-[13px]
                "
              >
                <Icon className="h-4 w-4 shrink-0 text-primary" />

                <span>{item.label}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}