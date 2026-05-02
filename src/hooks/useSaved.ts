"use client";

import { useState, useCallback } from "react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import type { SavedMotor, ApiSuccessResponse } from "@/types";

export function useSaved() {
  const [savedMotors, setSavedMotors] = useState<SavedMotor[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<ApiSuccessResponse<SavedMotor[]>>("/saved");
      setSavedMotors(res.data.data);
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  }, []);

  const saveMotor = useCallback(async (motorId: string) => {
    try {
      await api.post("/saved", { motorId });
      toast.success("Motor disimpan ke keranjang");
      return true;
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error("Motor sudah ada di keranjang");
      }
      return false;
    }
  }, []);

  const removeSaved = useCallback(async (motorId: string) => {
    try {
      await api.delete(`/saved/${motorId}`);
      setSavedMotors((prev) => prev.filter((s) => s.motorId !== motorId));
      toast.success("Motor dihapus dari keranjang");
      return true;
    } catch {
      return false;
    }
  }, []);

  const isSaved = useCallback(
    (motorId: string) => {
      return savedMotors.some((s) => s.motorId === motorId);
    },
    [savedMotors]
  );

  return {
    savedMotors,
    loading,
    fetchSaved,
    saveMotor,
    removeSaved,
    isSaved,
    savedCount: savedMotors.length,
  };
}
