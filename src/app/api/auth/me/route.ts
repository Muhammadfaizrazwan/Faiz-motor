import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return errorResponse("Unauthorized", "Not authenticated", 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
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
    });

    if (!user) {
      return errorResponse("User not found", "User not found", 404);
    }

    return successResponse(user, "User data retrieved");
  } catch (error) {
    console.error("Auth me error:", error);
    return errorResponse(
      "Internal server error",
      "Failed to get user data",
      500
    );
  }
}
