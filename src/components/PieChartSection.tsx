import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useFinance } from "../context/FinanceContext";

const COLORS = ["#3559e0", "#11b981", "#f59f0a", "#f43f5e"];

type Currency = "DKK" | "BRL";

function formatCurrency(value: number, currency: Currency) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}

function Donut({ currency }: { currency: Currency }) {
  const { categorySummary } = useFinance();
  const [isMounted, setIsMounted] = useState(false);
  const data = categorySummary.map((item) => ({
    name: item.category,
    value: currency === "DKK" ? item.dkk : item.brl,
  }));

  useEffect(() => setIsMounted(true), []);

  if (!isMounted) {
    return <div className="h-[300px]" />;
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <h4 className="mb-2 text-sm font-semibold text-slate-600">Gastos por categoria ({currency})</h4>
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={1}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85}>
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(Number(value), currency)} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 space-y-1 text-xs text-slate-700">
        {data.map((item) => (
          <p key={item.name} className="flex items-center justify-between">
            <span>{item.name}</span>
            <span>{formatCurrency(item.value, currency)}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

export function PieChartSection() {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      <Donut currency="BRL" />
      <Donut currency="DKK" />
    </section>
  );
}
