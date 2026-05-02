"use client";

import { useState, useCallback } from "react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import type { ApiSuccessResponse, MotorReviewsResponse } from "@/types";

export function useUserReviews(motorId: string) {
  const [reviewData, setReviewData] = useState<MotorReviewsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<ApiSuccessResponse<MotorReviewsResponse>>(
        `/motors/${motorId}/reviews`
      );
      setReviewData(res.data.data);
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  }, [motorId]);

  const submitReview = useCallback(
    async (data: { rating: number; comment: string }) => {
      setSubmitting(true);
      try {
        await api.post(`/motors/${motorId}/reviews`, data);
        toast.success("Ulasan berhasil dikirim! Terima kasih atas ulasan Anda.");
        await fetchReviews();
        return true;
      } catch (error: any) {
        if (error.response?.status === 409) {
          toast.error("Anda sudah memberikan ulasan untuk motor ini");
        }
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [motorId, fetchReviews]
  );

  const deleteReview = useCallback(
    async (reviewId: string) => {
      try {
        await api.delete(`/reviews/${reviewId}`);
        toast.success("Ulasan berhasil dihapus");
        await fetchReviews();
        return true;
      } catch (error) {
        toast.error("Gagal menghapus ulasan");
        return false;
      }
    },
    [fetchReviews]
  );

  const editReview = useCallback(
    async (reviewId: string, data: { rating: number; comment: string }) => {
      setSubmitting(true);
      try {
        await api.put(`/reviews/${reviewId}`, data);
        toast.success("Ulasan berhasil diperbarui");
        await fetchReviews();
        return true;
      } catch (error) {
        toast.error("Gagal memperbarui ulasan");
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [fetchReviews]
  );

  return {
    reviews: reviewData?.reviews || [],
    averageRating: reviewData?.averageRating || 0,
    totalReviews: reviewData?.totalReviews || 0,
    loading,
    submitting,
    fetchReviews,
    submitReview,
    deleteReview,
    editReview,
  };
}
