"use client";

import { useDashboard } from "@/hooks/useDashboard";
import { StatCard } from "@/components/admin/StatCard";
import { SalesChart } from "@/components/admin/SalesChart";
import { PopularMotors } from "@/components/admin/PopularMotors";
import { StatCardSkeleton, ChartSkeleton } from "@/components/admin/LoadingSkeleton";
import { Bike, CheckCircle2, ShoppingCart, Users } from "lucide-react";

export default function DashboardPage() {
  const { stats, chartData, popularMotors, loading } = useDashboard();

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : stats ? (
          <>
            <StatCard
              label="Total Motor"
              value={stats.totalMotors}
              icon={<Bike className="w-6 h-6" />}
              color="#E8390E"
              bgColor="#FEF2F2"
            />
            <StatCard
              label="Motor Tersedia"
              value={stats.totalAvailable}
              icon={<CheckCircle2 className="w-6 h-6" />}
              color="#22C55E"
              bgColor="#F0FDF4"
            />
            <StatCard
              label="Motor Terjual"
              value={stats.totalSold}
              icon={<ShoppingCart className="w-6 h-6" />}
              color="#F59E0B"
              bgColor="#FFFBEB"
            />
            <StatCard
              label="Total User"
              value={stats.totalUsers}
              icon={<Users className="w-6 h-6" />}
              color="#6366F1"
              bgColor="#EEF2FF"
            />
          </>
        ) : null}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {loading ? (
          <>
            <ChartSkeleton />
            <ChartSkeleton />
          </>
        ) : (
          <>
            <SalesChart data={chartData} />
            <PopularMotors data={popularMotors} />
          </>
        )}
      </div>
    </div>
  );
}
