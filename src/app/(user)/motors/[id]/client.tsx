"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { PhotoGallery } from "@/components/user/PhotoGallery";
import { SaveButton } from "@/components/user/SaveButton";
import { ReviewCard } from "@/components/user/ReviewCard";
import { ReviewForm } from "@/components/user/ReviewForm";
import { useUserReviews } from "@/hooks/useUserReviews";
import { Button } from "@/components/ui/button";
import { MessageCircle, Star } from "lucide-react";
import type { Motor } from "@/types";

interface Props {
  motor: Motor;
  section: "gallery" | "actions" | "tabs";
}

export function MotorDetailClient({ motor, section }: Props) {
  const { data: session } = useSession();

  if (section === "gallery") {
    return <PhotoGallery photos={motor.photos || []} />;
  }

  if (section === "actions") {
    return (
      <div className="flex flex-col sm:flex-row gap-3">
        <SaveButton motorId={motor.id} variant="full" />
        <a
          href={`https://wa.me/6282125428638?text=Halo%20Faiz%20Motor%2C%20saya%20tertarik%20dengan%20${encodeURIComponent(motor.name)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <Button className="w-full bg-[#25D366] hover:bg-[#1EBE57] text-white rounded-xl gap-2 shadow-md shadow-[#25D366]/20">
            <MessageCircle className="w-4 h-4" />
            Hubungi via WhatsApp
          </Button>
        </a>
      </div>
    );
  }

  // section === "tabs"
  return <TabsSection motor={motor} isLoggedIn={!!session?.user} />;
}

function TabsSection({ motor, isLoggedIn }: { motor: Motor; isLoggedIn: boolean }) {
  const { data: session } = useSession();
  const { reviews, averageRating, totalReviews, loading, submitting, fetchReviews, submitReview, editReview, deleteReview } = useUserReviews(motor.id);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleEditSubmit = async (data: { rating: number; comment: string }) => {
    if (editingReviewId) {
      const success = await editReview(editingReviewId, data);
      if (success) {
        setEditingReviewId(null);
      }
      return success;
    }
    return submitReview(data);
  };

  const handleDelete = async (id: string) => {
    setIsDeletingId(id);
    await deleteReview(id);
    setIsDeletingId(null);
  };

  const editingReview = reviews.find((r) => r.id === editingReviewId);
  const currentUserId = session?.user?.id;
  const userHasReview = reviews.some(r => r.userId === currentUserId);

  return (
    <div className="space-y-8">
      {/* Description */}
      {motor.description && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-[#0A1628] mb-3">Deskripsi</h2>
          <p className="text-sm text-[#64748B] leading-relaxed whitespace-pre-line">{motor.description}</p>
        </div>
      )}

      {/* Reviews */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#0A1628]">Ulasan</h2>
          {totalReviews > 0 && (
            <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-xl">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-bold text-amber-700">{averageRating}</span>
              <span className="text-xs text-amber-600">({totalReviews} ulasan)</span>
            </div>
          )}
        </div>

        {/* Review Form - Show if editing OR if user hasn't reviewed yet OR not logged in */}
        {(!userHasReview || editingReviewId || !isLoggedIn) && (
          <ReviewForm 
            onSubmit={handleEditSubmit} 
            isLoggedIn={isLoggedIn} 
            submitting={submitting} 
            initialData={editingReview}
            onCancel={() => setEditingReviewId(null)}
          />
        )}

        {/* Review List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-5 animate-pulse">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-24 bg-slate-200 rounded" />
                    <div className="h-3 w-16 bg-slate-200 rounded" />
                    <div className="h-3 w-full bg-slate-200 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-3">
            {reviews.map((review) => (
              <ReviewCard 
                key={review.id} 
                review={review} 
                currentUserId={currentUserId}
                onEdit={(r) => setEditingReviewId(r.id)}
                onDelete={handleDelete}
                isDeleting={isDeletingId === review.id}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#64748B] text-center py-6">Belum ada ulasan untuk motor ini</p>
        )}
      </div>
    </div>
  );
}
