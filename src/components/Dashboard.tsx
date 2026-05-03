import { PiggyBank, Trash2, Wallet } from "lucide-react";
import { useState } from "react";
import { useFinance } from "../context/FinanceContext";
import { PieChartSection } from "./PieChartSection";
import { TransactionForm } from "./TransactionForm";

function formatDKK(value: number) {
  return new Intl.NumberFormat("da-DK", {
    style: "currency",
    currency: "DKK",
  }).format(value);
}

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function Dashboard() {
  const { balance, addBalance, currentRate, deleteTransaction, filteredTransactions, loading } = useFinance();
  const [value, setValue] = useState("");
  const [balanceError, setBalanceError] = useState<string | null>(null);

  async function handleBalance(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Number(value);
    if (amount <= 0) return;
    try {
      setBalanceError(null);
      await addBalance(amount);
      setValue("");
    } catch (err: unknown) {
      const maybeCode = typeof err === "object" && err && "code" in err ? String(err.code) : "";
      const message = typeof err === "object" && err && "message" in err ? String(err.message) : String(err);
      console.error("[Dashboard] addBalance failed", { code: maybeCode, message, err });
      setBalanceError(maybeCode === "permission-denied" ? "Permissao negada pelo Firestore (regras)." : "Falha ao atualizar saldo.");
    }
  }

  const monthlyDKK = filteredTransactions.reduce((acc, item) => acc + item.valorDKK, 0);
  const monthlyBRL = filteredTransactions.reduce((acc, item) => acc + item.valorBRL, 0);

  return (
    <section className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="mb-2 flex items-center gap-2 text-slate-700">
            <Wallet size={18} />
            <h3 className="text-sm font-semibold uppercase tracking-wide">Saldo atual</h3>
          </div>
          <p className="text-2xl font-bold text-brand-700">{formatDKK(balance)}</p>
          {currentRate ? (
            <p className="mt-1 text-sm text-slate-500">Taxa atual DKK/BRL: {currentRate.toFixed(4)}</p>
          ) : (
            <p className="mt-1 text-sm text-rose-600">Taxa indisponivel no momento.</p>
          )}
        </article>
        <article className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="mb-2 flex items-center gap-2 text-slate-700">
            <PiggyBank size={18} />
            <h3 className="text-sm font-semibold uppercase tracking-wide">Adicionar saldo</h3>
          </div>
          {balanceError ? (
            <p className="mb-2 rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{balanceError}</p>
          ) : null}
          <form onSubmit={handleBalance} className="flex gap-2">
            <input
              value={value}
              onChange={(event) => setValue(event.target.value)}
              type="number"
              step="0.01"
              placeholder="Valor em DKK"
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
            />
            <button type="submit" className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white">
              Salvar
            </button>
          </form>
        </article>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <PieChartSection />
        <TransactionForm />
      </div>

      <article className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-700">Resumo do mes</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <p className="rounded-lg bg-slate-100 p-3 text-sm text-slate-700">
            Gastos em DKK: <span className="font-semibold">{formatDKK(monthlyDKK)}</span>
          </p>
          <p className="rounded-lg bg-slate-100 p-3 text-sm text-slate-700">
            Gastos em BRL: <span className="font-semibold">{formatBRL(monthlyBRL)}</span>
          </p>
        </div>
        <div className="mt-4 space-y-2 text-sm text-slate-700">
          {loading ? (
            <p>Carregando transacoes...</p>
          ) : (
            filteredTransactions.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2"
              >
                <span className="min-w-0 flex-1 truncate">{item.desc}</span>
                <span className="flex shrink-0 items-center gap-2 font-medium">
                  <span className="whitespace-nowrap text-right tabular-nums">
                    {formatDKK(item.valorDKK)} | {formatBRL(item.valorBRL)}
                  </span>
                  <button
                    type="button"
                    aria-label="Excluir transação"
                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-100 hover:text-rose-600"
                    onClick={async () => {
                      const ok = window.confirm("Deseja realmente excluir esta transação?");
                      if (!ok) return;
                      try {
                        await deleteTransaction(item.id);
                      } catch (err) {
                        console.error("[Dashboard] deleteTransaction failed", err);
                      }
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </span>
              </div>
            ))
          )}
        </div>
      </article>
    </section>
  );
}
