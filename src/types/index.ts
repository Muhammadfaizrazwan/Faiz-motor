import { Role, UserStatus } from "@prisma/client/index";
import "next-auth";

// Augment NextAuth types to include custom fields
declare module "next-auth" {
  interface User {
    id: string;
    role: Role;
    status: UserStatus;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: Role;
      status: UserStatus;
    };
  }
}

// ============================================
// Domain Models
// ============================================

export interface MotorPhoto {
  id: string;
  motorId: string;
  url: string;
  publicId: string;
  isPrimary: boolean;
  createdAt: string;
}

export interface Motor {
  id: string;
  name: string;
  brand: string;
  year: number;
  color: string;
  condition: "BARU" | "BEKAS";
  price: number;
  description: string | null;
  status: "TERSEDIA" | "DIPESAN" | "TERJUAL";
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  photos: MotorPhoto[];
  reviews?: Review[];
  _count?: {
    reviews: number;
    savedByUsers: number;
  };
}

export interface Review {
  id: string;
  userId: string;
  motorId: string;
  rating: number;
  comment: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
  };
  motor?: {
    id: string;
    name: string;
    brand: string;
  };
}

export interface SavedMotor {
  id: string;
  userId: string;
  motorId: string;
  createdAt: string;
  motor: Motor;
}

// ============================================
// API Response Types
// ============================================

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  message: string;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// Pagination
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T = unknown> {
  success: true;
  data: T[];
  meta: PaginationMeta;
  message: string;
}

// Reviews response from /api/motors/:id/reviews
export interface MotorReviewsResponse {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}
