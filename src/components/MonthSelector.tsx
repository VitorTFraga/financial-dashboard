import { CalendarDays } from "lucide-react";
import { MONTHS, useFinance } from "../context/FinanceContext";

export function MonthSelector() {
  const { selectedMonth, setSelectedMonth } = useFinance();

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="mb-3 flex items-center gap-2 text-slate-700">
        <CalendarDays size={18} />
        <h2 className="text-sm font-semibold uppercase tracking-wide">Filtro por mes</h2>
      </div>
      <div className="grid grid-cols-3 gap-2 md:grid-cols-5">
        {MONTHS.map((month) => (
          <button
            key={month}
            type="button"
            onClick={() => setSelectedMonth(month)}
            className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
              selectedMonth === month
                ? "bg-brand-500 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {month}
          </button>
        ))}
      </div>
    </div>
  );
}
