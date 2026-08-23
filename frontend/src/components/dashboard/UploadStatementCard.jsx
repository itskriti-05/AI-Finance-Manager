import { useRef } from "react";
import { ShieldCheck, Upload } from "lucide-react";

export default function UploadStatementCard({
  onUpload,
  uploading = false,
}) {
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;

    const isValid =
      file.type === "application/pdf" ||
      file.type === "text/csv" ||
      file.name.toLowerCase().endsWith(".pdf") ||
      file.name.toLowerCase().endsWith(".csv");

    if (!isValid) {
      alert("Only PDF or CSV files are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5 MB.");
      return;
    }

    onUpload(file);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      {/* DROP AREA */}
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();

          if (!uploading) {
            handleFile(e.dataTransfer.files?.[0]);
          }
        }}
        className="flex min-h-[240px] sm:min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background px-5 text-center transition hover:border-primary/50 hover:bg-secondary/20"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
          <Upload className="h-5 w-5 text-primary" />
        </div>

        <h2 className="mt-4 text-base font-semibold sm:text-lg">
          Welcome to Finwise
        </h2>

        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Upload your bank statement and let Finwise analyze your
          spending, categorize your transactions, build your budget,
          and unlock your financial insights.
        </p>

        <button
          type="button"
          disabled={uploading}
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Upload className="h-4 w-4" />

          {uploading ? "Analyzing..." : "Upload Statement"}
        </button>

        <p className="mt-3 text-xs text-muted-foreground">
          PDF or CSV · up to 5 MB
        </p>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.csv,application/pdf,text/csv"
          className="hidden"
          disabled={uploading}
          onChange={(e) => {
            handleFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>

      {/* BOTTOM */}
      <div className="mt-4 flex flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" />

          <span>
            Your statement is processed privately and never shared.
          </span>
        </div>

  
      </div>
    </div>
  );
}