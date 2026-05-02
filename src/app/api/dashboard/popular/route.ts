import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-response";

/**
 * GET /api/dashboard/popular
 * Get top 5 most viewed motors (ADMIN only)
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

    const popularMotors = await prisma.motor.findMany({
      orderBy: { viewCount: "desc" },
      take: 5,
      include: {
        photos: {
          where: { isPrimary: true },
          take: 1,
        },
        _count: {
          select: {
            reviews: { where: { status: "APPROVED" } },
            savedByUsers: true,
          },
        },
      },
    });

    return successResponse(popularMotors, "Popular motors retrieved");
  } catch (error) {
    console.error("Dashboard popular error:", error);
    return errorResponse(
      "Internal server error",
      "Failed to retrieve popular motors",
      500
    );
  }
}
