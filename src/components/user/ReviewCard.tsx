"use client";

import { Star } from "lucide-react";
import { formatRelativeTime } from "@/lib/format";
import type { Review } from "@/types";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0A1628] to-[#1E3A5F] flex items-center justify-center shrink-0">
          <span className="text-sm font-semibold text-white">
            {review.user.name.charAt(0).toUpperCase()}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-semibold text-[#0A1628] truncate">
              {review.user.name}
            </h4>
            <span className="text-[11px] text-[#64748B] shrink-0">
              {formatRelativeTime(review.createdAt)}
            </span>
          </div>

          {/* Stars */}
          <div className="flex items-center gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3.5 h-3.5 ${
                  star <= review.rating
                    ? "fill-amber-400 text-amber-400"
                    : "fill-slate-200 text-slate-200"
                }`}
              />
            ))}
          </div>

          {/* Comment */}
          <p className="text-sm text-[#64748B] mt-2 leading-relaxed">
            {review.comment}
          </p>
        </div>
      </div>
    </div>
  );
}
