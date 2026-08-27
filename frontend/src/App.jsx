import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import GuestRoute from "./routes/GuestRoute";
import Transactions from "./pages/Transactions";
import Categories from "./pages/Categories";
import Budget from "./pages/Budget";
import AskFinwise from "./pages/AskFinwise";
import { Settings } from "lucide-react";

function ComingSoon({ label }) {
  return (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
      {label} — coming soon.
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />

        {/* Guest Only */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/transactions" element={<Transactions/>} />
            <Route path="/dashboard/categories" element={<Categories/>} />
            <Route path="/dashboard/budget" element={<Budget/>} />
            <Route path="/dashboard/ask" element={<AskFinwise/>} />
            <Route path="/dashboard/settings" element={<Settings/>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;