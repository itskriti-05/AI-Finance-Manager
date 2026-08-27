import ThemeToggle from "../ui/ThemeToggle";

export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        )}
        {actions && (
          <div className="mt-3 flex items-center gap-2 sm:hidden">{actions}</div>
        )}
      </div>

      <div className="hidden shrink-0 items-center gap-2 sm:flex">
        <ThemeToggle />
        {actions}
      </div>
    </div>
  );
}