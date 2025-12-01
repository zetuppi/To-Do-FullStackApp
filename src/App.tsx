// Importações dos componentes de UI para notificações e tooltips
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

// Importações para gerenciamento de estado e queries do React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Importações para roteamento da aplicação
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Importações dos contextos para autenticação e tarefas
import { AuthProvider } from "./contexts/AuthContext";
import { TaskProvider } from "./contexts/TaskContext";

// Importações das páginas da aplicação
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

// Cria uma instância do cliente de queries para gerenciar estado assíncrono
const queryClient = new QueryClient();

// Componente principal da aplicação que configura todos os provedores e rotas
const App = () => (
  // Provedor do React Query para gerenciar queries e mutações
  <QueryClientProvider client={queryClient}>
    {/* Provedor de tooltips para toda a aplicação */}
    <TooltipProvider>
      {/* Provedor de autenticação para gerenciar estado de login */}
      <AuthProvider>
        {/* Provedor de tarefas para gerenciar estado das tarefas */}
        <TaskProvider>
          {/* Componentes de notificação para mensagens ao usuário */}
          <Toaster />
          <Sonner />
          {/* Configuração do roteamento da aplicação */}
          <BrowserRouter>
            <Routes>
              {/* Redireciona a rota raiz para o dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              {/* Rota para a página de autenticação */}
              <Route path="/auth" element={<Auth />} />
              {/* Rota protegida para o dashboard, só acessível se logado */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              {/* Rota para página 404 quando a rota não existe */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TaskProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
