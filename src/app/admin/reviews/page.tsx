"use client";

import { useEffect, useState } from "react";
import { useReviews } from "@/hooks/useReviews";
import { ReviewTable } from "@/components/admin/ReviewTable";
import { TableSkeleton } from "@/components/admin/LoadingSkeleton";
import { EmptyState } from "@/components/admin/EmptyState";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquareOff } from "lucide-react";

export default function ReviewsPage() {
  const { reviews, loading, fetchReviews, moderateReview, deleteReview } = useReviews();
  const [activeTab, setActiveTab] = useState("ALL");
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews(activeTab === "ALL" ? {} : { status: activeTab });
  }, [activeTab, fetchReviews]);

  const handleModerate = async (id: string, status: "APPROVED" | "REJECTED") => {
    setIsProcessing(id);
    await moderateReview(id, status);
    await fetchReviews(activeTab === "ALL" ? {} : { status: activeTab });
    setIsProcessing(null);
  };

  const handleDelete = async (id: string) => {
    setIsProcessing(id);
    await deleteReview(id);
    await fetchReviews(activeTab === "ALL" ? {} : { status: activeTab });
    setIsProcessing(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Tabs defaultValue="ALL" className="w-[400px]" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-slate-100">
            <TabsTrigger value="ALL">Semua</TabsTrigger>
            <TabsTrigger value="PENDING">Menunggu</TabsTrigger>
            <TabsTrigger value="APPROVED">Disetujui</TabsTrigger>
            <TabsTrigger value="REJECTED">Ditolak</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {loading ? (
        <TableSkeleton rows={8} />
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100">
          <EmptyState
            icon={<MessageSquareOff className="w-12 h-12 text-slate-300" />}
            title="Tidak ada ulasan"
            description={
              activeTab === "PENDING"
                ? "Semua ulasan sudah dimoderasi, bagus!"
                : "Belum ada ulasan yang sesuai dengan filter."
            }
          />
        </div>
      ) : (
        <ReviewTable
          data={reviews}
          onModerate={handleModerate}
          onDelete={handleDelete}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
}
