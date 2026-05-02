"use client";

import { useState, useCallback } from "react";
import api from "@/lib/axios";
import type { Motor, ApiSuccessResponse, MotorReviewsResponse } from "@/types";

export function useMotorDetail() {
  const [motor, setMotor] = useState<Motor | null>(null);
  const [reviews, setReviews] = useState<MotorReviewsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMotor = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<ApiSuccessResponse<Motor>>(`/motors/${id}`);
      setMotor(res.data.data);
    } catch {
      setError("Gagal memuat data motor");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchReviews = useCallback(async (motorId: string) => {
    try {
      const res = await api.get<ApiSuccessResponse<MotorReviewsResponse>>(
        `/motors/${motorId}/reviews`
      );
      setReviews(res.data.data);
    } catch {
      // Reviews are non-critical, don't set error
    }
  }, []);

  return { motor, reviews, loading, error, fetchMotor, fetchReviews };
}
