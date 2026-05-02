"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import type { MotorPhoto } from "@/types";

interface PhotoGalleryProps {
  photos: MotorPhoto[];
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!photos || photos.length === 0) {
    return (
      <div className="aspect-[4/3] bg-slate-100 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <ImageOff className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-400">Belum ada foto</p>
        </div>
      </div>
    );
  }

  const prev = () => setActiveIndex((i) => (i === 0 ? photos.length - 1 : i - 1));
  const next = () => setActiveIndex((i) => (i === photos.length - 1 ? 0 : i + 1));

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="relative aspect-[4/3] bg-slate-100 rounded-2xl overflow-hidden group">
        <Image
          src={photos[activeIndex].url}
          alt={`Photo ${activeIndex + 1}`}
          fill
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        {photos.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-white">
              <ChevronLeft className="w-5 h-5 text-[#0A1628]" />
            </button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-white">
              <ChevronRight className="w-5 h-5 text-[#0A1628]" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-white font-medium">
              {activeIndex + 1} / {photos.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {photos.map((photo, i) => (
            <button
              key={photo.id}
              onClick={() => setActiveIndex(i)}
              className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                i === activeIndex ? "border-[#E8390E] shadow-md" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={photo.url} alt={`Thumb ${i + 1}`} fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
