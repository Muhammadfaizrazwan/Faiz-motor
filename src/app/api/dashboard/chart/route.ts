import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-response";

/**
 * GET /api/dashboard/chart
 * Get motor sold per month for the last 12 months (ADMIN only)
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

    // Get last 12 months
    const now = new Date();
    const months: { month: string; year: number; monthNum: number; count: number }[] = [];

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      const count = await prisma.motor.count({
        where: {
          status: "TERJUAL",
          updatedAt: {
            gte: date,
            lt: nextMonth,
          },
        },
      });

      const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];

      months.push({
        month: monthNames[date.getMonth()],
        year: date.getFullYear(),
        monthNum: date.getMonth() + 1,
        count,
      });
    }

    return successResponse(months, "Chart data retrieved");
  } catch (error) {
    console.error("Dashboard chart error:", error);
    return errorResponse(
      "Internal server error",
      "Failed to retrieve chart data",
      500
    );
  }
}
