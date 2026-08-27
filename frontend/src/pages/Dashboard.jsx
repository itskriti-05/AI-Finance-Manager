import { useEffect, useState, useCallback, useRef } from "react";
import { Upload } from "lucide-react";

import { useAuthContext } from "../context/AuthContext";
import { analysisAPI } from "../api/analysis.api";
import { budgetAPI } from "../api/budget.api";
import { transactionAPI } from "../api/transaction.api";

import ThemeToggle from "../components/ui/ThemeToggle";
import UploadStatementCard from "../components/dashboard/UploadStatementCard";
import WeeklyFlowCard from "../components/dashboard/WeeklyFlowCard";
import CategoryBreakdown from "../components/dashboard/CategoryBreakdown";
import BudgetPlanner from "../components/dashboard/BudgetPlanner";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import AskFinwiseWidget from "../components/dashboard/AskFinwiseWidget";
import PageHeader from "../components/dashboard/PageHeader";

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";

  return "Good evening";
}

export default function Dashboard() {
  const { user } = useAuthContext();

  const [analysis, setAnalysis] = useState(null);
  const [budget, setBudget] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const headerInputRef = useRef(null);

  /*
   * Load all dashboard data from backend
   */
  const loadData = useCallback(async () => {
    setLoading(true);

    try {
      const [analysisData, budgetData, transactionData] = await Promise.all([
        analysisAPI.weekly(),
        budgetAPI.get(),
        transactionAPI.list(5),
      ]);

      setAnalysis(analysisData);
      setBudget(budgetData);
      setTransactions(transactionData?.transactions || []);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  /*
   * Load dashboard when page opens
   */
  useEffect(() => {
    loadData();
  }, [loadData]);

  const hasTransactions = transactions.length > 0;

  /*
   * Validate uploaded file
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
   * Upload statement to backend
   */
  const handleUpload = async (file) => {
    if (!file || !validateFile(file)) return;

    try {
      setUploading(true);

      await transactionAPI.upload(file);

      /*
       * After backend processes the statement,
       * reload all dashboard data.
       */
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

  /*
   * Header upload button
   */
  const openHeaderFilePicker = () => {
    if (!uploading) {
      headerInputRef.current?.click();
    }
  };

  const firstName = user?.name?.split(" ")[0] || "";

  return (
    <div className="min-h-full bg-background">
      {/* =========================================
          HEADER
      ========================================= */}

      <input
        ref={headerInputRef}
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

      <PageHeader
        title={`${getGreeting()}, ${firstName}`}
        subtitle={
          hasTransactions
            ? `${transactions.length} recent transaction${transactions.length === 1 ? "" : "s"}`
            : "Upload your first statement to get started"
        }
        actions={
          <button
            type="button"
            onClick={openHeaderFilePicker}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Upload className="h-4 w-4" />
            {uploading ? "Analyzing..." : "Upload statement"}
          </button>
        }
      />

      {/* =========================================
          FIRST-TIME UPLOAD
      ========================================= */}

      {!hasTransactions && !loading && (
        <div className="mb-6">
          <UploadStatementCard onUpload={handleUpload} uploading={uploading} />
        </div>
      )}

      {/* =========================================
          BENTO DASHBOARD
      ========================================= */}

      {!loading && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* WEEKLY FLOW */}
          <div className="order-1 lg:order-none lg:col-span-2">
            <WeeklyFlowCard
              flow={analysis?.weeklyMoneyFlow}
              hasTransactions={hasTransactions}
            />
          </div>

          <div className="order-2 lg:order-none">
            <CategoryBreakdown
              categoryBudgets={budget?.categoryBudgets}
              hasTransactions={hasTransactions}
            />
          </div>

          <div className="order-3 lg:order-none">
            <BudgetPlanner
              categoryBudgets={budget?.categoryBudgets}
              hasTransactions={hasTransactions}
            />
          </div>

          {/* RECENT TRANSACTIONS */}
          <div className="order-4 lg:order-none lg:col-span-3">
            <RecentTransactions
              transactions={transactions}
              hasTransactions={hasTransactions}
            />
          </div>

          {/* ASK FINWISE */}
          <div className="order-5 lg:order-none lg:col-start-3 lg:row-start-1 lg:row-span-2">
            <AskFinwiseWidget hasTransactions={hasTransactions} />
          </div>
        </div>
      )}

      {/* =========================================
          LOADING
      ========================================= */}

      {loading && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
          <span className="rounded-lg bg-background/80 px-3 py-2 text-sm text-muted-foreground backdrop-blur">
            Loading...
          </span>
        </div>
      )}
    </div>
  );
}
