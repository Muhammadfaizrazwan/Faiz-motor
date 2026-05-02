"use client";

import { useState } from "react";
import { Star, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { formatRelativeTime } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Review } from "@/types";

interface ReviewCardProps {
  review: Review;
  currentUserId?: string;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
  isDeleting?: boolean;
}

export function ReviewCard({ review, currentUserId, onEdit, onDelete, isDeleting }: ReviewCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const isOwner = currentUserId === review.userId;

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
            
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#64748B] shrink-0">
                {formatRelativeTime(review.createdAt)}
              </span>
              
              {isOwner && onEdit && onDelete && (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-slate-100 outline-none -mr-2 transition-colors">
                    <MoreVertical className="w-4 h-4 text-slate-500" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-36 rounded-xl">
                    <DropdownMenuItem onClick={() => onEdit(review)} className="text-sm gap-2 cursor-pointer">
                      <Edit2 className="w-4 h-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setShowConfirm(true)} 
                      className="text-sm text-red-600 focus:text-red-600 gap-2 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" /> Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
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
          
          {/* Delete Confirmation Inline */}
          {showConfirm && (
            <div className="mt-3 bg-red-50 p-3 rounded-lg border border-red-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <p className="text-xs text-red-600">Yakin ingin menghapus ulasan ini?</p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 px-2 text-xs" 
                  onClick={() => setShowConfirm(false)}
                  disabled={isDeleting}
                >
                  Batal
                </Button>
                <Button 
                  size="sm" 
                  className="h-7 px-2 text-xs bg-red-600 hover:bg-red-700 text-white" 
                  onClick={() => {
                    onDelete?.(review.id);
                    setShowConfirm(false);
                  }}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Menghapus..." : "Ya, Hapus"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
