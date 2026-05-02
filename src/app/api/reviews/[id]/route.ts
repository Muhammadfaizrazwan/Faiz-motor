import { type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-response";

/**
 * DELETE /api/reviews/:id
 * Delete a review (ADMIN only)
 */
export async function DELETE(
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

    const existing = await prisma.review.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse("Review not found", "Review not found", 404);
    }

    await prisma.review.delete({ where: { id } });

    return successResponse(null, "Review deleted successfully");
  } catch (error) {
    console.error("Delete review error:", error);
    return errorResponse(
      "Internal server error",
      "Failed to delete review",
      500
    );
  }
}
