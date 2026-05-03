import { LogOut } from "lucide-react";
import { Route, Routes } from "react-router-dom";
import { Dashboard } from "./components/Dashboard";
import { MonthSelector } from "./components/MonthSelector";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import { Login } from "./pages/Login";

function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-4 p-4 pb-8 md:p-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">Controle Financeiro do Casal</h1>
          <p className="text-sm text-slate-600">
            Painel mensal para acompanhar gastos em DKK e BRL na Dinamarca.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-slate-200">
          {user?.photoURL ? (
            <img src={user.photoURL} alt={user.displayName ?? "Usuario"} className="h-9 w-9 rounded-full object-cover" />
          ) : (
            <div className="h-9 w-9 rounded-full bg-slate-200" />
          )}
          <div>
            <p className="text-sm font-semibold text-slate-900">{user?.displayName ?? "Usuario"}</p>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="ml-2 rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100"
            title="Sair"
            aria-label="Sair"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>
      <MonthSelector />
      <Dashboard />
    </main>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
