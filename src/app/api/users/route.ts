import { type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { successResponse, errorResponse, paginatedResponse } from "@/lib/api-response";

/**
 * GET /api/users
 * Get all users with search and filter (ADMIN only)
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
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") as "ACTIVE" | "BLOCKED" | null;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const where: {
      status?: "ACTIVE" | "BLOCKED";
      OR?: Array<{
        name?: { contains: string };
        email?: { contains: string };
      }>;
    } = {};

    if (status && ["ACTIVE", "BLOCKED"].includes(status)) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              reviews: true,
              savedMotors: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return paginatedResponse(users, { page, limit, total }, "Users retrieved");
  } catch (error) {
    console.error("Get users error:", error);
    return errorResponse(
      "Internal server error",
      "Failed to retrieve users",
      500
    );
  }
}
