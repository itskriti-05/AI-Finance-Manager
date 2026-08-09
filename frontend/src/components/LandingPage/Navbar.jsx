import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "../ui/ThemeToggle";

const links = [
  { label: "Features", href: "#features" },
  { label: "AI Agents", href: "#agents" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Close mobile menu when screen becomes desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-border bg-background/85 backdrop-blur-xl"
          : "border-transparent bg-background"
      }`}
    >
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        {/* ================= LOGO ================= */}

        <Link
          to="/"
          className="flex shrink-0 items-center gap-2"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground sm:h-9 sm:w-9">
            F
          </span>

          <span className="text-[15px] font-semibold tracking-tight sm:text-base">
            Finwise
          </span>
        </Link>

        {/* ================= DESKTOP NAV ================= */}

        <ul className="ml-8 hidden flex-1 items-center gap-5 lg:flex xl:ml-12 xl:gap-7">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="whitespace-nowrap text-[13px] text-muted-foreground transition-colors duration-200 hover:text-foreground xl:text-sm"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* ================= RIGHT SIDE ================= */}

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          {/* Login */}

          <Link
            to="/login"
            className="hidden rounded-xl px-3 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            Login
          </Link>

          {/* Get Started */}

          <Link
            to="/signup"
            className="hidden rounded-xl bg-primary px-4 py-2 text-[13px] font-medium text-primary-foreground transition-all duration-200 hover:opacity-90 sm:inline-flex"
          >
            Get Started
          </Link>

          {/* Mobile Menu Button */}

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border transition-colors hover:bg-muted lg:hidden"
          >
            {open ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </nav>

      {/* ================= MOBILE MENU ================= */}

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6">
            <ul className="space-y-1">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Mobile Actions */}

            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-5">
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-border px-4 py-2.5 text-center text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Login
              </Link>

              <Link
                to="/signup"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-primary px-4 py-2.5 text-center text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}