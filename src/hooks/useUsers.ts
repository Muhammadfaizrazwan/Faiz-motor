"use client";

import { useState, useCallback } from "react";
import api from "@/lib/axios";
import toast from "react-hot-toast";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  status: string;
  createdAt: string;
  _count?: { reviews: number; savedMotors: number };
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async (params: { search?: string; status?: string; page?: number; limit?: number } = {}) => {
    setLoading(true);
    try {
      const res = await api.get("/users", { params: { limit: 10, ...params } });
      setUsers(res.data.data);
      setMeta(res.data.meta);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleUserStatus = useCallback(async (id: string, status: "ACTIVE" | "BLOCKED") => {
    await api.patch(`/users/${id}/status`, { status });
    toast.success(`User berhasil ${status === "BLOCKED" ? "diblokir" : "diaktifkan"}`);
  }, []);

  return { users, meta, loading, fetchUsers, toggleUserStatus };
}
