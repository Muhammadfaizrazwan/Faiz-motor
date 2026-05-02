"use client";

import { useEffect, useState } from "react";
import { useReviews } from "@/hooks/useReviews";
import { ReviewTable } from "@/components/admin/ReviewTable";
import { TableSkeleton } from "@/components/admin/LoadingSkeleton";
import { EmptyState } from "@/components/admin/EmptyState";
import { MessageSquareOff } from "lucide-react";

export default function ReviewsPage() {
  const { reviews, loading, fetchReviews, deleteReview } = useReviews();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews({});
  }, [fetchReviews]);

  const handleDelete = async (id: string) => {
    setIsProcessing(id);
    await deleteReview(id);
    await fetchReviews({});
    setIsProcessing(null);
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <TableSkeleton rows={8} />
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100">
          <EmptyState
            icon={<MessageSquareOff className="w-12 h-12 text-slate-300" />}
            title="Tidak ada ulasan"
            description="Belum ada ulasan dari pelanggan."
          />
        </div>
      ) : (
        <ReviewTable
          data={reviews}
          onDelete={handleDelete}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
}
