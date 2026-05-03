import { useEffect, useState } from "react";
import { CATEGORIES, MONTHS, useFinance } from "../context/FinanceContext";

export function TransactionForm() {
  const { addTransaction, selectedMonth } = useFinance();
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<"DKK" | "BRL">("DKK");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Alimentação");
  const [month, setMonth] = useState<(typeof MONTHS)[number]>(selectedMonth);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMonth(selectedMonth);
  }, [selectedMonth]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedAmount = Number(amount);
    if (!desc.trim() || normalizedAmount <= 0) return;

    try {
      setError(null);
      await addTransaction({
        desc: desc.trim(),
        amount: normalizedAmount,
        currency,
        category,
        month,
        date,
      });

      setDesc("");
      setAmount("");
    } catch (err: unknown) {
      const maybeCode = typeof err === "object" && err && "code" in err ? String(err.code) : "";
      const message = typeof err === "object" && err && "message" in err ? String(err.message) : String(err);
      console.error("[TransactionForm] addTransaction failed", { code: maybeCode, message, err });
      setError(maybeCode === "permission-denied" ? "Permissao negada pelo Firestore (regras)." : "Falha ao salvar transacao.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <h3 className="text-base font-semibold text-slate-900">Adicionar transacao</h3>
      {error ? <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{error}</p> : null}
      <input
        value={desc}
        onChange={(event) => setDesc(event.target.value)}
        placeholder="Descricao"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
      />
      <div className="grid grid-cols-2 gap-3">
        <input
          value={amount}
          type="number"
          step="0.01"
          onChange={(event) => setAmount(event.target.value)}
          placeholder="Valor"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
        />
        <select
          value={currency}
          onChange={(event) => setCurrency(event.target.value as "DKK" | "BRL")}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
        >
          <option value="DKK">DKK</option>
          <option value="BRL">BRL</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value as (typeof CATEGORIES)[number])}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
        >
          {CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          value={month}
          onChange={(event) => setMonth(event.target.value as (typeof MONTHS)[number])}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
        >
          {MONTHS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <input
        value={date}
        type="date"
        onChange={(event) => setDate(event.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
      />
      <button
        type="submit"
        className="w-full rounded-lg bg-brand-500 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700"
      >
        Salvar transacao
      </button>
    </form>
  );
}
