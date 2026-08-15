import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getSellerSalesAnalytics } from "../../api/seller.api";

type Period = "7days" | "30days" | "3months" | "6months" | "1year";

interface SalesDataPoint {
  date: string;
  sales: number;
  orders: number;
  productsSold: number;
}

const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: "7days", label: "Last 7 Days" },
  { value: "30days", label: "Last 30 Days" },
  { value: "3months", label: "Last 3 Months" },
  { value: "6months", label: "Last 6 Months" },
  { value: "1year", label: "Last 1 Year" },
];

function SellerSalesOverview() {
  const [period, setPeriod] = useState<Period>("30days");
  const [data, setData] = useState<SalesDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const result = await getSellerSalesAnalytics(period);
        setData(result);
      } catch (err) {
        console.log("Error fetching analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [period]);

  const totalRevenue = data.reduce((sum, d) => sum + d.sales, 0);
  const currentPeriodLabel = PERIOD_OPTIONS.find((opt) => opt.value === period)?.label;

  return (
    <div className="rounded-xl border border-border-default bg-surface-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">
          Sales Overview
        </h2>

        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as Period)}
          className="rounded-lg border border-border-default bg-surface-card px-3 py-1.5 text-sm text-text-primary focus:outline-none"
        >
          {PERIOD_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="py-10 text-center text-sm text-text-secondary">
          Loading chart...
        </p>
      ) : data.length === 0 ? (
        <p className="py-10 text-center text-sm text-text-secondary">
          No sales data for this period.
        </p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-text-primary)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="var(--color-text-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-default)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })
                }
              />
              <YAxis tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-surface-card)",
                  border: "1px solid var(--color-border-default)",
                  borderRadius: "8px",
                  color: "var(--color-text-primary)",
                }}
                labelStyle={{ color: "var(--color-text-primary)" }}
                itemStyle={{ color: "var(--color-text-primary)" }}
                formatter={(value) => [`₹${value}`, "Sales"]}
                labelFormatter={(label) =>
                  new Date(label as string).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                }
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="var(--color-text-primary)"
                strokeWidth={2}
                fill="url(#salesGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>

          <p className="mt-2 text-center text-sm text-text-secondary">
            {currentPeriodLabel} Revenue:{" "}
            <span className="font-semibold text-text-primary">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </span>
          </p>
        </>
      )}
    </div>
  );
}

export default SellerSalesOverview;