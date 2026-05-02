"use client";

import { useState, useCallback } from "react";
import api from "@/lib/axios";
import toast from "react-hot-toast";

interface Review {
  id: string;
  rating: number;
  comment: string;
  status: string;
  createdAt: string;
  user: { id: string; name: string; email: string };
  motor: { id: string; name: string; brand: string };
}

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async (params: { status?: string; page?: number; limit?: number } = {}) => {
    setLoading(true);
    try {
      const res = await api.get("/reviews", { params: { limit: 10, ...params } });
      setReviews(res.data.data);
      setMeta(res.data.meta);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  }, []);

  const moderateReview = useCallback(async (id: string, status: "APPROVED" | "REJECTED") => {
    await api.patch(`/reviews/${id}/moderate`, { status });
    toast.success(`Ulasan berhasil ${status === "APPROVED" ? "disetujui" : "ditolak"}`);
  }, []);

  const deleteReview = useCallback(async (id: string) => {
    await api.delete(`/reviews/${id}`);
    toast.success("Ulasan berhasil dihapus");
  }, []);

  return { reviews, meta, loading, fetchReviews, moderateReview, deleteReview };
}
