import { useEffect, useState, useCallback, useRef } from "react";
import {
  Upload,
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  X,
  Check,
  Info,
  SlidersHorizontal,
} from "lucide-react";

import { transactionAPI } from "../api/transaction.api";
import { categoryAPI } from "../api/category.api";
import PageHeader from "../components/dashboard/PageHeader";

function formatDate(date) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const categories = [
  "Rent",
  "Food",
  "Shopping",
  "Groceries",
  "Entertainment",
  "Electronics",
  "Bills",
  "Travel",
  "Personal Transfer",
  "Savings",
  "Other",
];

function getConfidenceLabel(confidence) {
  if (confidence === "high") return "High confidence";
  if (confidence === "low") return "Low confidence";
  return "Not categorized";
}

function getConfidenceDescription(confidence) {
  if (confidence === "high") {
    return "Finwise is highly confident about this category.";
  }

  if (confidence === "low") {
    return "Finwise assigned this category using an AI-based prediction. Review it if it doesn't look right.";
  }

  return "Finwise could not confidently determine this category yet.";
}

function ConfidenceBadge({ confidence }) {
  const isHigh = confidence === "high";
  const isLow = confidence === "low";

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${
        isHigh
          ? "text-success"
          : isLow
          ? "text-primary"
          : "text-muted-foreground"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isHigh
            ? "bg-success"
            : isLow
            ? "bg-primary"
            : "bg-muted-foreground"
        }`}
      />

      {getConfidenceLabel(confidence)}
    </span>
  );
}

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [confidenceFilter, setConfidenceFilter] = useState("All");

  const [showConfidenceInfo, setShowConfidenceInfo] = useState(false);

  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [saveAsRule, setSaveAsRule] = useState(true);
  const [updatingCategory, setUpdatingCategory] = useState(false);

  const inputRef = useRef(null);

  /*
   * Load transactions
   */
  const loadData = useCallback(async () => {
    setLoading(true);

    try {
      const data = await transactionAPI.list(50);

      setTransactions(data?.transactions || []);
    } catch (error) {
      console.error("Failed to load transactions:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /*
   * File validation
   */
  const validateFile = (file) => {
    if (!file) return false;

    const isValid =
      file.type === "application/pdf" ||
      file.type === "text/csv" ||
      file.name.toLowerCase().endsWith(".pdf") ||
      file.name.toLowerCase().endsWith(".csv");

    if (!isValid) {
      alert("Only PDF or CSV files are allowed.");
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5 MB.");
      return false;
    }

    return true;
  };

  /*
   * Upload statement
   */
  const handleUpload = async (file) => {
    if (!file || !validateFile(file)) return;

    try {
      setUploading(true);

      await transactionAPI.upload(file);

      await loadData();
    } catch (error) {
      console.error("Statement upload failed:", error);

      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to upload statement. Please try again.";

      alert(message);
    } finally {
      setUploading(false);
    }
  };

  const openFilePicker = () => {
    if (!uploading) {
      inputRef.current?.click();
    }
  };

  /*
   * Open category editor
   */
  const openCategoryEditor = (transaction) => {
    setSelectedTransaction(transaction);
    setSelectedCategory(transaction.category || "Other");
    setSaveAsRule(true);
  };

  /*
   * Close category editor
   */
  const closeCategoryEditor = () => {
    if (updatingCategory) return;

    setSelectedTransaction(null);
    setSelectedCategory("");
    setSaveAsRule(true);
  };

  /*
   * Save category
   */
  const handleCategoryUpdate = async () => {
    if (!selectedTransaction || !selectedCategory) return;

    try {
      setUpdatingCategory(true);

      await categoryAPI.update(
        selectedTransaction._id,
        selectedCategory,
        saveAsRule
      );

      await loadData();

      closeCategoryEditor();
    } catch (error) {
      console.error("Failed to update category:", error);

      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to update category. Please try again.";

      alert(message);
    } finally {
      setUpdatingCategory(false);
    }
  };

  /*
   * Filter transactions
   */
  const filteredTransactions = transactions.filter((transaction) => {
    const payee = transaction.payee?.toLowerCase() || "";
    const category = transaction.category || "Uncategorized";
    const confidence = transaction.confidence || "none";

    const matchesSearch = payee.includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" ||
      category.toLowerCase() === categoryFilter.toLowerCase();

    const matchesType =
      typeFilter === "All" ||
      transaction.type === typeFilter;

    const matchesConfidence =
      confidenceFilter === "All" ||
      confidence === confidenceFilter;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesType &&
      matchesConfidence
    );
  });

  const hasTransactions = transactions.length > 0;

  return (
    <div className="min-h-full bg-background">
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.csv,application/pdf,text/csv"
        className="hidden"
        disabled={uploading}
        onChange={(e) => {
          const file = e.target.files?.[0];

          if (file) {
            handleUpload(file);
          }

          e.target.value = "";
        }}
      />

      {/* Header */}
      <PageHeader
        title="Transactions"
        subtitle={
          hasTransactions
            ? `${transactions.length} transaction${
                transactions.length === 1 ? "" : "s"
              }`
            : "All your transactions will appear here"
        }
        actions={
          <button
            type="button"
            onClick={openFilePicker}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Upload className="h-4 w-4" />

            {uploading ? "Analyzing..." : "Upload statement"}
          </button>
        }
      />

      {/* Loading */}
      {loading ? (
        <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
          Loading transactions...
        </div>
      ) : !hasTransactions ? (
        /* Empty state */
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
            <Upload className="h-4 w-4 text-primary" />
          </div>

          <p className="mt-4 text-sm font-medium">
            No transactions yet
          </p>

          <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-muted-foreground">
            Upload a statement to see your categorized transactions
            here.
          </p>

          <button
            type="button"
            onClick={openFilePicker}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Upload className="h-4 w-4" />
            Upload statement
          </button>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex flex-col gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search transactions..."
                  className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <select
                  value={categoryFilter}
                  onChange={(e) =>
                    setCategoryFilter(e.target.value)
                  }
                  className="rounded-xl border border-border bg-background px-3 py-2.5 text-xs outline-none focus:border-primary"
                >
                  <option value="All">All categories</option>

                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <select
                  value={typeFilter}
                  onChange={(e) =>
                    setTypeFilter(e.target.value)
                  }
                  className="rounded-xl border border-border bg-background px-3 py-2.5 text-xs outline-none focus:border-primary"
                >
                  <option value="All">All transactions</option>
                  <option value="DR">Debited</option>
                  <option value="CR">Credited</option>
                </select>

                <select
                  value={confidenceFilter}
                  onChange={(e) =>
                    setConfidenceFilter(e.target.value)
                  }
                  className="rounded-xl border border-border bg-background px-3 py-2.5 text-xs outline-none focus:border-primary"
                >
                  <option value="All">All confidence</option>
                  <option value="high">High confidence</option>
                  <option value="low">Low confidence</option>
                  <option value="none">Not categorized</option>
                </select>
              </div>

              {/* Confidence explanation */}
              <div className="relative flex items-center justify-between border-t border-border pt-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />

                  <span className="text-[11px] text-muted-foreground">
                    Review low-confidence categories if needed.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowConfidenceInfo((value) => !value)
                  }
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground"
                >
                  <Info className="h-3.5 w-3.5" />
                  What is confidence?
                </button>

                {showConfidenceInfo && (
                  <div className="absolute right-0 top-full z-20 mt-2 w-full max-w-sm rounded-xl border border-border bg-card p-4 shadow-lg sm:w-80">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">
                          Category confidence
                        </p>

                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          Confidence shows how reliably Finwise
                          assigned a category to a transaction.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfidenceInfo(false)
                        }
                        className="rounded-md p-1 text-muted-foreground hover:bg-secondary"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="mt-3 space-y-2.5">
                      <div>
                        <ConfidenceBadge confidence="high" />

                        <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                          Finwise is highly confident about the
                          assigned category.
                        </p>
                      </div>

                      <div>
                        <ConfidenceBadge confidence="low" />

                        <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                          Finwise used an AI-based prediction.
                          Review it if it doesn't look right.
                        </p>
                      </div>

                      <div>
                        <ConfidenceBadge confidence="none" />

                        <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                          Finwise could not confidently determine
                          the category.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Showing {filteredTransactions.length} of{" "}
              {transactions.length} transactions
            </p>

            {(search ||
              categoryFilter !== "All" ||
              typeFilter !== "All" ||
              confidenceFilter !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategoryFilter("All");
                  setTypeFilter("All");
                  setConfidenceFilter("All");
                }}
                className="text-xs font-medium text-primary hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Transactions */}
          <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card">
            {filteredTransactions.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm font-medium">
                  No matching transactions
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Try changing your search or filters.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filteredTransactions.map((transaction) => {
                  const isCredit = transaction.type === "CR";

                  return (
                    <div
                      key={transaction._id}
                      className="p-4 transition-colors hover:bg-secondary/20 sm:px-5"
                    >
                      {/* Desktop / tablet row */}
                      <div className="flex items-center gap-3">
                        {/* Transaction icon */}
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary">
                          {isCredit ? (
                            <ArrowDownLeft className="h-4 w-4 text-success" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4 text-primary" />
                          )}
                        </div>

                        {/* Main info */}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {transaction.payee}
                          </p>

                          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
                            <span>
                              {transaction.category ||
                                "Uncategorized"}
                            </span>

                            <span>·</span>

                            <span>
                              {formatDate(transaction.date)}
                            </span>

                            <span className="hidden sm:inline">
                              ·
                            </span>

                            <span className="hidden sm:inline-flex">
                              <ConfidenceBadge
                                confidence={
                                  transaction.confidence
                                }
                              />
                            </span>
                          </div>
                        </div>

                        {/* Amount */}
                        <p
                          className={`shrink-0 text-sm font-semibold tabular-nums ${
                            isCredit
                              ? "text-success"
                              : "text-foreground"
                          }`}
                        >
                          {isCredit ? "+" : "-"}₹
                          {Number(
                            transaction.amount || 0
                          ).toLocaleString("en-IN")}
                        </p>

                        {/* Change category desktop */}
                        <button
                          type="button"
                          onClick={() =>
                            openCategoryEditor(transaction)
                          }
                          className="hidden shrink-0 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:inline-flex"
                        >
                          Change category
                        </button>
                      </div>

                      {/* Mobile information */}
                      <div className="mt-3 flex items-center justify-between gap-3 pl-12 sm:hidden">
                        <ConfidenceBadge
                          confidence={transaction.confidence}
                        />

                        <button
                          type="button"
                          onClick={() =>
                            openCategoryEditor(transaction)
                          }
                          className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                        >
                          Change category
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* Category modal */}
      {selectedTransaction && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeCategoryEditor();
            }
          }}
        >
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-xl">
            {/* Modal header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold">
                  Change category
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  Update how this transaction is categorized.
                </p>
              </div>

              <button
                type="button"
                onClick={closeCategoryEditor}
                disabled={updatingCategory}
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Transaction */}
            <div className="mt-5 rounded-xl bg-secondary/50 p-4">
              <p className="truncate text-sm font-semibold">
                {selectedTransaction.payee}
              </p>

              <div className="mt-1 flex items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">
                  {formatDate(selectedTransaction.date)}
                </p>

                <p
                  className={`text-sm font-semibold ${
                    selectedTransaction.type === "CR"
                      ? "text-success"
                      : "text-foreground"
                  }`}
                >
                  {selectedTransaction.type === "CR"
                    ? "+"
                    : "-"}
                  ₹
                  {Number(
                    selectedTransaction.amount || 0
                  ).toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Category */}
            <div className="mt-5">
              <label className="text-sm font-medium">
                Category
              </label>

              <select
                value={selectedCategory}
                onChange={(e) =>
                  setSelectedCategory(e.target.value)
                }
                disabled={updatingCategory}
                className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Remember rule */}
            <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-border p-3">
              <input
                type="checkbox"
                checked={saveAsRule}
                onChange={(e) =>
                  setSaveAsRule(e.target.checked)
                }
                disabled={updatingCategory}
                className="mt-0.5 h-4 w-4 accent-primary"
              />

              <div>
                <p className="text-sm font-medium">
                  Remember this for future transactions
                </p>

                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Finwise will use this category for future
                  transactions from this payee.
                </p>
              </div>
            </label>

            {/* Current confidence */}
            <div className="mt-4 rounded-xl bg-secondary/50 p-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">
                  Current confidence
                </span>

                <ConfidenceBadge
                  confidence={
                    selectedTransaction.confidence
                  }
                />
              </div>

              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                {getConfidenceDescription(
                  selectedTransaction.confidence
                )}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeCategoryEditor}
                disabled={updatingCategory}
                className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleCategoryUpdate}
                disabled={
                  updatingCategory || !selectedCategory
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Check className="h-4 w-4" />

                {updatingCategory
                  ? "Saving..."
                  : "Save category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}