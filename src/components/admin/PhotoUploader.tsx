"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { UploadCloud, X, Star, Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import toast from "react-hot-toast";

interface PhotoUploaderProps {
  motorId?: string; // If undefined, we're in 'add' mode and just collecting files
  existingPhotos?: { id: string; url: string; publicId: string; isPrimary: boolean }[];
  onFilesChange?: (files: File[]) => void;
  onPhotosUpdated?: () => void;
}

export function PhotoUploader({
  motorId,
  existingPhotos = [],
  onFilesChange,
  onPhotosUpdated,
}: PhotoUploaderProps) {
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length + existingPhotos.length + newFiles.length > 10) {
        toast.error("Maksimal 10 foto diperbolehkan");
        return;
      }

      setNewFiles((prev) => [...prev, ...acceptedFiles]);
      setPreviewUrls((prev) => [
        ...prev,
        ...acceptedFiles.map((file) => URL.createObjectURL(file)),
      ]);

      if (onFilesChange) {
        onFilesChange([...newFiles, ...acceptedFiles]);
      }
    },
    [existingPhotos.length, newFiles, onFilesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const removeNewFile = (index: number) => {
    const newFilesList = [...newFiles];
    newFilesList.splice(index, 1);
    setNewFiles(newFilesList);

    const newUrlsList = [...previewUrls];
    URL.revokeObjectURL(newUrlsList[index]);
    newUrlsList.splice(index, 1);
    setPreviewUrls(newUrlsList);

    if (onFilesChange) {
      onFilesChange(newFilesList);
    }
  };

  const deleteExistingPhoto = async (photoId: string) => {
    setIsDeleting(photoId);
    try {
      await api.delete(`/photos/${photoId}`);
      toast.success("Foto berhasil dihapus");
      if (onPhotosUpdated) onPhotosUpdated();
    } catch {
      // handled
    } finally {
      setIsDeleting(null);
    }
  };

  const setPrimary = async (photoId: string) => {
    try {
      await api.patch(`/photos/${photoId}/primary`);
      toast.success("Foto utama berhasil diubah");
      if (onPhotosUpdated) onPhotosUpdated();
    } catch {
      // handled
    }
  };

  const uploadNow = async () => {
    if (!motorId || newFiles.length === 0) return;
    
    setIsUploading(true);
    try {
      const formData = new FormData();
      newFiles.forEach((file) => formData.append("photos", file));
      
      await api.post(`/motors/${motorId}/photos`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      toast.success("Foto berhasil diupload");
      setNewFiles([]);
      setPreviewUrls([]);
      if (onPhotosUpdated) onPhotosUpdated();
    } catch {
      // handled
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-[#E8390E] bg-[#E8390E]/5"
            : "border-slate-300 hover:border-[#E8390E]/50 hover:bg-slate-50"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="p-3 bg-slate-100 rounded-full">
            <UploadCloud className="w-6 h-6 text-slate-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">
              Drag & drop foto di sini, atau klik untuk memilih file
            </p>
            <p className="text-xs text-slate-500 mt-1">
              PNG, JPG atau WEBP (Maksimal 5MB per file)
            </p>
          </div>
        </div>
      </div>

      {(existingPhotos.length > 0 || newFiles.length > 0) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
          {/* Existing Photos */}
          {existingPhotos.map((photo) => (
            <div
              key={photo.id}
              className={`relative group aspect-square rounded-lg overflow-hidden border-2 ${
                photo.isPrimary ? "border-[#E8390E]" : "border-slate-200"
              }`}
            >
              <Image
                src={photo.url}
                alt="Motor photo"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 20vw"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!photo.isPrimary && (
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); setPrimary(photo.id); }}
                    className="p-1.5 bg-white/20 hover:bg-white/40 rounded-md text-white backdrop-blur-sm transition-colors"
                    title="Jadikan Foto Utama"
                  >
                    <Star className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); deleteExistingPhoto(photo.id); }}
                  disabled={isDeleting === photo.id}
                  className="p-1.5 bg-red-500/80 hover:bg-red-600 rounded-md text-white backdrop-blur-sm transition-colors disabled:opacity-50"
                >
                  {isDeleting === photo.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
              {photo.isPrimary && (
                <div className="absolute top-2 left-2 bg-[#E8390E] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                  UTAMA
                </div>
              )}
            </div>
          ))}

          {/* New Files Preview */}
          {previewUrls.map((url, index) => (
            <div
              key={url}
              className="relative group aspect-square rounded-lg overflow-hidden border-2 border-blue-200 opacity-80"
            >
              <Image src={url} alt="New photo" fill className="object-cover" />
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); removeNewFile(index); }}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="absolute bottom-0 inset-x-0 bg-blue-500/80 text-white text-[10px] text-center py-1 backdrop-blur-sm">
                Baru (Belum Disimpan)
              </div>
            </div>
          ))}
        </div>
      )}

      {motorId && newFiles.length > 0 && (
        <div className="flex justify-end pt-2">
          <Button
            type="button"
            onClick={uploadNow}
            disabled={isUploading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isUploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Upload {newFiles.length} Foto Baru
          </Button>
        </div>
      )}
    </div>
  );
}

// Needed for Trash2 icon inside the component since it wasn't imported at top
import { Trash2 } from "lucide-react";
