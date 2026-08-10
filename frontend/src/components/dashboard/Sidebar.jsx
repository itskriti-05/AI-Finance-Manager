import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  LayoutGrid,
  Receipt,
  Tag,
  Wallet,
  MessageCircle,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuthContext } from "../../context/AuthContext";
import ConfirmDialog from "../ui/ConfirmDialog";

const navItems = [
  { label: "Overview", to: "/dashboard", icon: LayoutGrid, end: true },
  { label: "Transactions", to: "/dashboard/transactions", icon: Receipt },
  { label: "Categories", to: "/dashboard/categories", icon: Tag },
  { label: "Budget", to: "/dashboard/budget", icon: Wallet },
  { label: "Ask Finwise", to: "/dashboard/ask", icon: MessageCircle },
  { label: "Settings", to: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const { logout, user } = useAuthContext();
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-border bg-background">
      <div className="flex h-16 items-center gap-2 px-5">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            F
          </span>
          <span className="text-[15px] font-semibold tracking-tight">Finwise</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              }`
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
            {user?.name?.slice(0, 1)?.toUpperCase() || "?"}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user?.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Log out
        </button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Log out of Finwise?"
        message="You'll need to log in again to access your dashboard."
        confirmLabel="Log out"
        cancelLabel="Stay logged in"
        onConfirm={logout}
        onCancel={() => setConfirmOpen(false)}
      />
    </aside>
  );
}