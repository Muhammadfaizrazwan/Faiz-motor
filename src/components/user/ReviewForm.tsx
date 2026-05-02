"use client";

import { useState } from "react";
import { Star, Send, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

interface ReviewFormProps {
  onSubmit: (data: { rating: number; comment: string }) => Promise<boolean>;
  isLoggedIn: boolean;
  submitting: boolean;
}

export function ReviewForm({ onSubmit, isLoggedIn, submitting }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<{ rating?: string; comment?: string }>({});

  if (!isLoggedIn) {
    return (
      <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100">
        <LogIn className="w-8 h-8 text-[#64748B] mx-auto mb-3" />
        <p className="text-sm text-[#64748B] mb-4">
          Masuk untuk memberikan ulasan
        </p>
        <Link href="/login">
          <Button
            size="sm"
            className="bg-[#E8390E] hover:bg-[#d13009] rounded-xl gap-2"
          >
            <LogIn className="w-4 h-4" />
            Masuk Sekarang
          </Button>
        </Link>
      </div>
    );
  }

  const handleSubmit = async () => {
    const newErrors: { rating?: string; comment?: string } = {};
    if (rating === 0) newErrors.rating = "Pilih rating terlebih dahulu";
    if (comment.length < 5) newErrors.comment = "Ulasan minimal 5 karakter";
    if (comment.length > 1000) newErrors.comment = "Ulasan maksimal 1000 karakter";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const success = await onSubmit({ rating, comment });
    if (success) {
      setRating(0);
      setComment("");
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
      <h4 className="text-sm font-semibold text-[#0A1628]">Tulis Ulasan</h4>

      {/* Star Rating */}
      <div>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-0.5 transition-transform hover:scale-110"
            >
              <Star
                className={`w-6 h-6 transition-colors ${
                  star <= (hoveredRating || rating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-slate-200 text-slate-200"
                }`}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="text-sm text-[#64748B] ml-2">
              {rating}/5
            </span>
          )}
        </div>
        {errors.rating && (
          <p className="text-xs text-red-500 mt-1">{errors.rating}</p>
        )}
      </div>

      {/* Comment */}
      <div>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Bagikan pengalaman Anda tentang motor ini..."
          className="resize-none h-24 text-sm"
        />
        <div className="flex items-center justify-between mt-1">
          {errors.comment ? (
            <p className="text-xs text-red-500">{errors.comment}</p>
          ) : (
            <span />
          )}
          <span className="text-[11px] text-[#64748B]">
            {comment.length}/1000
          </span>
        </div>
      </div>

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={submitting}
        className="bg-[#E8390E] hover:bg-[#d13009] rounded-xl gap-2 w-full sm:w-auto"
        size="sm"
      >
        <Send className="w-4 h-4" />
        {submitting ? "Mengirim..." : "Kirim Ulasan"}
      </Button>
    </div>
  );
}
