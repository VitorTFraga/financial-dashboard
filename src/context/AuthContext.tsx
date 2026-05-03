import { onAuthStateChanged, signOut, type User, getRedirectResult } from "firebase/auth";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, authPersistenceReady, googleProvider, signInWithGoogle } from "../firebase";

const ALLOWED_EMAILS = ["vitortaboasfraga@gmail.com", "catielen.p@gmail.com"] as const;

type AuthContextData = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  signIn: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPersistenceReady, setIsPersistenceReady] = useState(false);
  const [isRedirectResultReady, setIsRedirectResultReady] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    authPersistenceReady
      .then(() => {
        setIsPersistenceReady(true);
      })
      .catch((err: unknown) => {
        const code = typeof err === "object" && err && "code" in err ? String(err.code) : "";
        if (code !== "auth/no-auth-event") {
          setError("Falha no login. Tente novamente.");
        }
      })
      .finally(() => {
        googleProvider.setCustomParameters({ prompt: "select_account" });
      });
  }, []);

  useEffect(() => {
    if (!isPersistenceReady) {
      return;
    }

    const runRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          setUser(result.user);
        }
      } catch (error: unknown) {
        console.error("Erro detalhado:", error);
        const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
        if (code !== "auth/no-auth-event") {
          setError("Falha no login. Tente novamente.");
        }
      } finally {
        setIsRedirectResultReady(true);
      }
    };

    runRedirectResult();
  }, [isPersistenceReady]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      try {
        if (!isRedirectResultReady) {
          setLoading(true);
          return;
        }

        if (!nextUser) {
          setUser(null);
          setLoading(false);
          return;
        }

        let userWithFallback = nextUser;
        let resolvedEmail = nextUser.email?.toLowerCase().trim();

        if (!resolvedEmail) {
          await userWithFallback.reload();
          userWithFallback = auth.currentUser ?? nextUser;
          const providerDataEmail = userWithFallback.providerData[0]?.email;
          resolvedEmail = userWithFallback.email?.toLowerCase().trim() ?? providerDataEmail?.toLowerCase().trim();
        }

        if (!resolvedEmail) {
          setUser(userWithFallback);
          setLoading(true);
          return;
        }

        const allowedEmailsNormalized = ALLOWED_EMAILS.map((email) => email.toLowerCase().trim());
        const allowed = allowedEmailsNormalized.includes(resolvedEmail);

        if (!allowed) {
          setUser(null);
          setError("Acesso Restrito");
          await signOut(auth);
          setLoading(false);
          navigate("/login", { replace: true, state: { error: "Acesso Restrito" } });
          return;
        }

        setUser(userWithFallback);
        setError(null);
        setLoading(false);

        if (location.pathname === "/login") {
          navigate("/", { replace: true });
        }
      } catch (error: unknown) {
        console.error("Erro detalhado:", error);
        setError("Falha no login. Tente novamente.");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [isRedirectResultReady, location.pathname, navigate]);

  async function signIn() {
    setError(null);
    const result = await signInWithGoogle();
    if (result?.user) {
      setUser(result.user);
      setLoading(true);
    }
  }

  async function logout() {
    await signOut(auth);
    setUser(null);
    navigate("/login", { replace: true });
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      isAuthenticated: Boolean(user),
      signIn,
      logout,
    }),
    [error, loading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  }

  return context;
}
