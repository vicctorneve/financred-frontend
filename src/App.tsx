
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import NotFoundPage from "./pages/NotFoundPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import Index from "./pages/Index";
import ClientsPage from "./pages/clients/ClientsPage";
import ClientDetailsPage from "./pages/clients/ClientDetailsPage";
import ClientFormPage from "./pages/clients/ClientFormPage";
import ClientRegisterFormPage from "./pages/clients/ClientRegisterFormPage";
import LoansPage from "./pages/loans/LoansPage";
import LoanDetailsPage from "./pages/loans/LoanDetailsPage";
import LoanFormPage from "./pages/loans/LoanFormPage";
import LoanSimulationPage from "./pages/loans/LoanSimulationPage";
import PaymentsPage from "./pages/payments/PaymentsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/client/register" element={<ClientRegisterFormPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            
            <Route path="/clientes" element={<ClientsPage />} />
            <Route path="/clients/new" element={<ClientFormPage />} />
            <Route path="/clients/:id" element={<ClientDetailsPage />} />
            <Route path="/clients/:id/edit" element={<ClientFormPage />} />
            
            <Route path="/emprestimos" element={<LoansPage />} />
            <Route path="/emprestimos/novo" element={<LoanFormPage />} />
            <Route path="/emprestimo/:id" element={<LoanDetailsPage />} />
            <Route path="/emprestimo/simulacao" element={<LoanSimulationPage />} />
            
            <Route path="/pagamentos" element={<PaymentsPage />} />
                        
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
