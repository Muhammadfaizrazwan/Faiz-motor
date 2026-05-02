import { type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { moderateReviewSchema } from "@/lib/validations/review";
import { successResponse, errorResponse } from "@/lib/api-response";

/**
 * PATCH /api/reviews/:id/moderate
 * Approve or reject a review (ADMIN only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return errorResponse("Unauthorized", "Authentication required", 401);
    }
    if (session.user.role !== "ADMIN") {
      return errorResponse("Forbidden", "Admin access required", 403);
    }

    const { id } = await params;
    const body = await request.json();

    const parsed = moderateReviewSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(
        JSON.stringify(parsed.error.flatten().fieldErrors),
        "Validation failed",
        400
      );
    }

    const existing = await prisma.review.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse("Review not found", "Review not found", 404);
    }

    const review = await prisma.review.update({
      where: { id },
      data: { status: parsed.data.status },
      include: {
        user: {
          select: { id: true, name: true },
        },
        motor: {
          select: { id: true, name: true },
        },
      },
    });

    return successResponse(
      review,
      `Review ${parsed.data.status.toLowerCase()} successfully`
    );
  } catch (error) {
    console.error("Moderate review error:", error);
    return errorResponse(
      "Internal server error",
      "Failed to moderate review",
      500
    );
  }
}
