import { type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { successResponse, errorResponse, paginatedResponse } from "@/lib/api-response";

/**
 * GET /api/admin/saved
 * Get ALL saved motors across all users (ADMIN only)
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
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const where = search
      ? {
          OR: [
            { user: { name: { contains: search } } },
            { user: { email: { contains: search } } },
            { motor: { name: { contains: search } } },
          ],
        }
      : {};

    const skip = (page - 1) * limit;

    const [savedMotors, total] = await Promise.all([
      prisma.savedMotor.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true, phone: true },
          },
          motor: {
            select: { id: true, name: true, brand: true, price: true, status: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.savedMotor.count({ where }),
    ]);

    return paginatedResponse(savedMotors, { page, limit, total }, "Saved motors retrieved");
  } catch (error) {
    console.error("Get admin saved motors error:", error);
    return errorResponse(
      "Internal server error",
      "Failed to retrieve saved motors",
      500
    );
  }
}
