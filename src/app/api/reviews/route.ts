import { type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { successResponse, errorResponse, paginatedResponse } from "@/lib/api-response";

/**
 * GET /api/reviews
 * Get all reviews with optional status filter (ADMIN only)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return errorResponse("Unauthorized", "Authentication required", 401);
    }
    if (session.user.role !== "ADMIN") {
      return errorResponse("Forbidden", "Admin access required", 403);
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") as
      | "PENDING"
      | "APPROVED"
      | "REJECTED"
      | null;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const where: { status?: "PENDING" | "APPROVED" | "REJECTED" } = {};
    if (status && ["PENDING", "APPROVED", "REJECTED"].includes(status)) {
      where.status = status;
    }

    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
          motor: {
            select: { id: true, name: true, brand: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.review.count({ where }),
    ]);

    return paginatedResponse(
      reviews,
      { page, limit, total },
      "Reviews retrieved"
    );
  } catch (error) {
    console.error("Get all reviews error:", error);
    return errorResponse(
      "Internal server error",
      "Failed to retrieve reviews",
      500
    );
  }
}
