import { useEffect, useState } from "react";
import { Users, CreditCard, BadgeIndianRupee, Inbox } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { dashboardService } from "@/services/dashboard.service";
import type { DashboardStats } from "@/lib/types";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dashboardService
      .stats()
      .then(setStats)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load stats"));
  }, []);

  const revenue = (stats?.revenueByMonth ?? []).map((r) => ({
    month: r.month,
    revenue: r.totalMinor / 100,
  }));
  const byPlan = stats?.membershipsByPlan ?? [];

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of your gym at a glance" />

      {error && <p className="mb-4 text-sm text-[#FF5757]">{error}</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Members" value={stats?.totalUsers ?? 0} icon={Users} />
        <StatCard label="Active Memberships" value={stats?.activeMemberships ?? 0} icon={CreditCard} />
        <StatCard
          label="Total Revenue"
          value={Math.round((stats?.totalRevenueMinor ?? 0) / 100)}
          icon={BadgeIndianRupee}
          prefix="₹"
        />
        <StatCard label="New Enquiries" value={stats?.newContacts ?? 0} icon={Inbox} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-medium text-muted-foreground">Revenue by month (₹)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="month" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 8 }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#FF0000" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-medium text-muted-foreground">Memberships by plan</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byPlan}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="planName" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 8 }}
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                />
                <Bar dataKey="count" fill="#FF0000" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
