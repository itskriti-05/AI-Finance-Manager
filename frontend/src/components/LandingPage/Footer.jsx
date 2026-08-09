import { ArrowRight } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom";

export function FinalCTA() {
  return (
    <section
      id="cta"
      className="border-b border-border bg-background"
    >
      <div className="mx-auto max-w-3xl px-6 py-20 text-center sm:py-24 lg:py-28">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Ready to Take Control of Your Finances?
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          Upload your first statement and get clear, AI-powered insights
          into your spending in minutes.
        </p>

        <Link
          to="/signup"
          className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-all duration-200 hover:opacity-90"
        >
          Get Started

          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}



const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "AI Agents", href: "#agents" },
      { label: "Dashboard", href: "#dashboard" },
      { label: "How It Works", href: "#how-it-works" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
];



export function Footercols() {
  return (
    <footer
      id="contact"
      className="bg-background"
    >
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">

          {/* Brand */}

          <div className="lg:col-span-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                F
              </span>

              <span className="text-lg font-semibold tracking-tight text-foreground">
                Finwise
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              AI-powered personal finance for people who want clarity,
              not chores.
            </p>

            {/* Social Links */}

            <div className="mt-5 flex gap-2">
              <a
                href="#"
                aria-label="GitHub"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground"
              >
                <FaGithub className="h-4 w-4" />
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground"
              >
                <FaLinkedinIn className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Footer Columns */}

          {footerColumns.map((column) => (
            <div key={column.title}>
              <p className="text-[13px] font-semibold text-foreground">
                {column.title}
              </p>

              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}

        <div className="mt-12 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Finwise. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}



export default function Footer() {
  return (
    <>
      <FinalCTA />
      <Footercols />
    </>
  );
}