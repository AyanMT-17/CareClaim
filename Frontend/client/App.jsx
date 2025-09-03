import "./global.css";

import { Toaster } from "@/components/ui/toaster.jsx";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner.jsx";
import { TooltipProvider } from "@/components/ui/tooltip.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import SubmitClaimPage from "./pages/SubmitClaimPage.jsx";
import ClaimsPage from "./pages/ClaimsPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import NotFound from "./pages/NotFound.jsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/submit" element={<SubmitClaimPage />} />
          <Route path="/claims" element={<ClaimsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")).render(<App />);
