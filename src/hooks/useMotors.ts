"use client";

import { useState, useCallback } from "react";
import api from "@/lib/axios";
import toast from "react-hot-toast";

interface Motor {
  id: string;
  name: string;
  brand: string;
  year: number;
  color: string;
  condition: string;
  price: number;
  description: string | null;
  status: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  photos: { id: string; url: string; publicId: string; isPrimary: boolean }[];
  _count?: { reviews: number; savedByUsers: number };
}

interface MotorsResponse {
  data: Motor[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

interface FetchParams {
  brand?: string;
  condition?: string;
  status?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export function useMotors() {
  const [motors, setMotors] = useState<Motor[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);

  const fetchMotors = useCallback(async (params: FetchParams = {}) => {
    setLoading(true);
    try {
      const res = await api.get<MotorsResponse>("/motors", { params: { limit: 10, ...params } });
      setMotors(res.data.data);
      setMeta(res.data.meta);
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteMotor = useCallback(async (id: string) => {
    await api.delete(`/motors/${id}`);
    toast.success("Motor berhasil dihapus");
  }, []);

  const createMotor = useCallback(async (data: Record<string, unknown>) => {
    const res = await api.post("/motors", data);
    toast.success("Motor berhasil ditambahkan");
    return res.data.data;
  }, []);

  const updateMotor = useCallback(async (id: string, data: Record<string, unknown>) => {
    const res = await api.put(`/motors/${id}`, data);
    toast.success("Motor berhasil diupdate");
    return res.data.data;
  }, []);

  const uploadPhotos = useCallback(async (motorId: string, files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("photos", file));
    const res = await api.post(`/motors/${motorId}/photos`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    toast.success(`${files.length} foto berhasil diupload`);
    return res.data.data;
  }, []);

  return { motors, meta, loading, fetchMotors, deleteMotor, createMotor, updateMotor, uploadPhotos };
}
