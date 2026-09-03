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
  X,
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

export default function Sidebar({ open = false, onClose }) {
  const { logout, user } = useAuthContext();
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

            <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-44 shrink-0 flex-col rounded-r-3xl bg-sidebar-bg text-sidebar-text transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between gap-2 px-4">
          <Link to="/dashboard" className="flex items-center gap-2" onClick={onClose}>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sidebar-active text-sm font-bold text-sidebar-text-active">
              F
            </span>
            <span className="text-[14px] font-semibold tracking-tight text-sidebar-heading">
              Finwise
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-lg p-1 text-sidebar-text hover:bg-sidebar-active/50 lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 px-2.5">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors ${
                  isActive
                    ? "bg-sidebar-active text-sidebar-text-active"
                    : "text-sidebar-text hover:bg-sidebar-active/50 hover:text-sidebar-text-active"
                }`
              }
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-2.5">
          <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sidebar-active text-xs font-semibold text-sidebar-text-active">
              {user?.name?.slice(0, 1)?.toUpperCase() || "?"}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-sidebar-heading">{user?.name}</p>
              <p className="truncate text-[11px] text-sidebar-text/70">{user?.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="mt-0.5 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-sidebar-text transition-colors hover:bg-sidebar-active/50 hover:text-sidebar-text-active"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Log out
          </button>
        </div>

      </aside>
        <ConfirmDialog
          open={confirmOpen}
          title="Log out of Finwise?"
          message="You'll need to log in again to access your dashboard."
          confirmLabel="Log out"
          cancelLabel="Stay logged in"
          onConfirm={logout}
          onCancel={() => setConfirmOpen(false)}
        />
    </>
  );
}