import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export function Login() {
  const { signIn, error } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  async function handleGoogleLogin() {
    try {
      setLoading(true);
      setActionError(null);
      await signIn();
    } catch {
      setActionError("Nao foi possivel iniciar o login. Verifique sua conexao e tente novamente.");
      setLoading(false);
    }
  }

  const routeError =
    typeof location.state === "object" && location.state && "error" in location.state
      ? String(location.state.error)
      : null;

  const visibleError = routeError ?? actionError ?? error;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
        <h1 className="text-center text-3xl font-bold tracking-tight text-slate-900">DKK Financial</h1>
        <p className="mt-2 text-center text-sm text-slate-500">Acesse sua conta autorizada para continuar.</p>

        {visibleError ? (
          <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{visibleError}</p>
        ) : null}

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5" aria-hidden>
            <path
              fill="#FFC107"
              d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.209 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
            />
            <path
              fill="#FF3D00"
              d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.168 0 9.868-1.977 13.409-5.192l-6.19-5.238C29.143 35.091 26.669 36 24 36c-5.188 0-9.625-3.327-11.287-7.946l-6.522 5.025C9.501 39.556 16.227 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.084 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
            />
          </svg>
          {loading ? "Redirecionando..." : "Entrar com Google"}
        </button>
      </section>
    </main>
  );
}
