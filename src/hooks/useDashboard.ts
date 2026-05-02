"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";

interface DashboardStats {
  totalMotors: number;
  totalAvailable: number;
  totalSold: number;
  totalBooked: number;
  totalUsers: number;
  pendingReviews: number;
}

interface ChartData {
  month: string;
  year: number;
  monthNum: number;
  count: number;
}

interface PopularMotor {
  id: string;
  name: string;
  brand: string;
  viewCount: number;
  photos: { url: string }[];
}

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [popularMotors, setPopularMotors] = useState<PopularMotor[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, chartRes, popularRes] = await Promise.all([
        api.get("/dashboard/stats"),
        api.get("/dashboard/chart"),
        api.get("/dashboard/popular"),
      ]);
      setStats(statsRes.data.data);
      setChartData(chartRes.data.data);
      setPopularMotors(popularRes.data.data);
    } catch {
      // Error handled by axios interceptor
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { stats, chartData, popularMotors, loading, refresh: fetchAll };
}
