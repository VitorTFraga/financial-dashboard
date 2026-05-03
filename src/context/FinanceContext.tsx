import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import { db } from "../firebase";
import { getDkkToBrlRate } from "../services/exchangeRate";

export const CATEGORIES = ["Aluguel", "Alimentação", "Transporte", "Extras"] as const;
export const MONTHS = ["Maio", "Junho", "Julho", "Agosto", "Setembro"] as const;

type Category = (typeof CATEGORIES)[number];
type Month = (typeof MONTHS)[number];

export type Transaction = {
  id: string;
  desc: string;
  valorDKK: number;
  valorBRL: number;
  categoria: Category;
  data: string;
  mes: Month;
  taxaCambioNoMomento: number;
  createdBy?: string;
  userEmail?: string;
};

type FinanceContextData = {
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  balance: number;
  selectedMonth: Month;
  loading: boolean;
  currentRate: number | null;
  setSelectedMonth: (month: Month) => void;
  addBalance: (amount: number) => Promise<void>;
  addTransaction: (input: {
    desc: string;
    category: Category;
    amount: number;
    currency: "DKK" | "BRL";
    month: Month;
    date: string;
  }) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  categorySummary: {
    category: Category;
    dkk: number;
    brl: number;
  }[];
};

const FinanceContext = createContext<FinanceContextData | undefined>(undefined);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const SHARED_BALANCE_DOC_ID = "shared_balance";
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState<Month>("Maio");
  const [loading, setLoading] = useState(true);
  const [currentRate, setCurrentRate] = useState<number | null>(null);

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setBalance(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    const transactionsQuery = query(collection(db, "transactions"), orderBy("data", "desc"));

    const unsubscribeTransactions = onSnapshot(transactionsQuery, (snapshot) => {
      const list = snapshot.docs.map((item) => ({
        id: item.id,
        ...(item.data() as Omit<Transaction, "id">),
      }));
      setTransactions(list);
      setLoading(false);
    });

    const unsubscribeBalance = onSnapshot(doc(db, "balance", SHARED_BALANCE_DOC_ID), (snapshot) => {
      if (snapshot.exists()) {
        setBalance(Number(snapshot.data().total ?? 0));
      } else {
        setBalance(0);
      }
    });

    getDkkToBrlRate().then(setCurrentRate).catch(() => setCurrentRate(null));

    return () => {
      unsubscribeTransactions();
      unsubscribeBalance();
    };
  }, [user]);

  const filteredTransactions = useMemo(
    () => transactions.filter((transaction) => transaction.mes === selectedMonth),
    [selectedMonth, transactions],
  );

  const categorySummary = useMemo(
    () =>
      CATEGORIES.map((category) => {
        const fromCategory = filteredTransactions.filter((item) => item.categoria === category);
        const dkk = fromCategory.reduce((total, item) => total + item.valorDKK, 0);
        const brl = fromCategory.reduce((total, item) => total + item.valorBRL, 0);
        return { category, dkk, brl };
      }),
    [filteredTransactions],
  );

  async function addBalance(amount: number) {
    if (!user?.email) throw new Error("Usuario nao autenticado.");

    const next = balance + amount;
    setBalance(next);

    await setDoc(doc(db, "balance", SHARED_BALANCE_DOC_ID), {
      total: next,
      updatedAt: serverTimestamp(),
      createdBy: user.uid,
      userEmail: user.email,
    });
  }

  async function addTransaction(input: {
    desc: string;
    category: Category;
    amount: number;
    currency: "DKK" | "BRL";
    month: Month;
    date: string;
  }) {
    if (!user?.email) throw new Error("Usuario nao autenticado.");

    const rate = await getDkkToBrlRate();
    const amountDKK = input.currency === "DKK" ? input.amount : input.amount / rate;
    const amountBRL = input.currency === "BRL" ? input.amount : input.amount * rate;

    const payload = {
      desc: input.desc,
      valorDKK: Number(amountDKK.toFixed(2)),
      valorBRL: Number(amountBRL.toFixed(2)),
      categoria: input.category,
      data: input.date,
      mes: input.month,
      taxaCambioNoMomento: rate,
      createdBy: user.uid,
      userEmail: user.email,
    };

    await addDoc(collection(db, "transactions"), payload);
    setCurrentRate(rate);
  }

  async function deleteTransaction(id: string) {
    if (!user?.email) throw new Error("Usuario nao autenticado.");

    await deleteDoc(doc(db, "transactions", id));
  }

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        filteredTransactions,
        balance,
        selectedMonth,
        loading,
        currentRate,
        setSelectedMonth,
        addBalance,
        addTransaction,
        deleteTransaction,
        categorySummary,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);

  if (!context) {
    throw new Error("useFinance deve ser usado dentro de FinanceProvider.");
  }

  return context;
}
