"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSaved } from "@/hooks/useSaved";
import { useAuthStore } from "@/store/authStore";

interface SaveButtonProps {
  motorId: string;
  saved?: boolean;
  variant?: "icon" | "full";
}

export function SaveButton({ motorId, saved: initialSaved = false, variant = "full" }: SaveButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { saveMotor, removeSaved } = useSaved();
  const { incrementSavedCount, decrementSavedCount } = useAuthStore();
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    setLoading(true);
    if (isSaved) {
      const success = await removeSaved(motorId);
      if (success) {
        setIsSaved(false);
        decrementSavedCount();
      }
    } else {
      const success = await saveMotor(motorId);
      if (success) {
        setIsSaved(true);
        incrementSavedCount();
      }
    }
    setLoading(false);
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`p-2.5 rounded-xl border transition-all ${
          isSaved
            ? "bg-red-50 border-red-200 text-red-500"
            : "bg-white border-slate-200 text-[#64748B] hover:text-red-500 hover:border-red-200"
        }`}
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Heart className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
        )}
      </button>
    );
  }

  return (
    <Button
      onClick={handleToggle}
      disabled={loading}
      variant="outline"
      className={`rounded-xl gap-2 transition-all ${
        isSaved
          ? "bg-red-50 border-red-200 text-red-500 hover:bg-red-100"
          : "border-slate-200 text-[#64748B] hover:text-red-500 hover:border-red-200"
      }`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
      )}
      {isSaved ? "Tersimpan" : "Simpan ke Keranjang"}
    </Button>
  );
}
