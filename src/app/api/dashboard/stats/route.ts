import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-response";

/**
 * GET /api/dashboard/stats
 * Get dashboard statistics (ADMIN only)
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return errorResponse("Unauthorized", "Authentication required", 401);
    }
    if (session.user.role !== "ADMIN") {
      return errorResponse("Forbidden", "Admin access required", 403);
    }

    const [
      totalMotors,
      totalAvailable,
      totalSold,
      totalBooked,
      totalUsers,
      pendingReviews,
    ] = await Promise.all([
      prisma.motor.count(),
      prisma.motor.count({ where: { status: "TERSEDIA" } }),
      prisma.motor.count({ where: { status: "TERJUAL" } }),
      prisma.motor.count({ where: { status: "DIPESAN" } }),
      prisma.user.count({ where: { role: "USER" } }),
      prisma.review.count({ where: { status: "PENDING" } }),
    ]);

    return successResponse(
      {
        totalMotors,
        totalAvailable,
        totalSold,
        totalBooked,
        totalUsers,
        pendingReviews,
      },
      "Dashboard stats retrieved"
    );
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return errorResponse(
      "Internal server error",
      "Failed to retrieve dashboard stats",
      500
    );
  }
}
