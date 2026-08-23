import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "../components/dashboard/Sidebar";
import ThemeToggle from "../components/ui/ThemeToggle";

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Fixed sidebar */}
      <Sidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* Dashboard area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4 lg:hidden">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                F
              </span>

              <span className="text-[15px] font-semibold tracking-tight">
                Finwise
              </span>
            </div>
          </div>

          <ThemeToggle />
        </header>

        {/* ONLY this area scrolls */}
        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1400px] p-4 sm:p-6 lg:p-7">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}