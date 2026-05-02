import { type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-response";

/**
 * PUT /api/reviews/:id
 * Edit a review (Must be owner)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return errorResponse("Unauthorized", "Authentication required", 401);
    }

    const { id } = await params;

    const existing = await prisma.review.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse("Review not found", "Review not found", 404);
    }

    if (existing.userId !== session.user.id) {
      return errorResponse("Forbidden", "You can only edit your own review", 403);
    }

    const body = await request.json();
    const { rating, comment } = body;

    if (!rating || rating < 1 || rating > 5) {
      return errorResponse("Invalid rating", "Rating must be between 1 and 5", 400);
    }
    if (!comment || comment.length < 5 || comment.length > 1000) {
      return errorResponse("Invalid comment", "Comment must be 5-1000 characters", 400);
    }

    const updated = await prisma.review.update({
      where: { id },
      data: { rating, comment },
      include: {
        user: { select: { id: true, name: true } },
      },
    });

    return successResponse(updated, "Review updated successfully");
  } catch (error) {
    console.error("Update review error:", error);
    return errorResponse("Internal server error", "Failed to update review", 500);
  }
}

/**
 * DELETE /api/reviews/:id
 * Delete a review (Admin OR Owner)
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

    const { id } = await params;

    const existing = await prisma.review.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse("Review not found", "Review not found", 404);
    }

    if (existing.userId !== session.user.id && (session.user as any).role !== "ADMIN") {
      return errorResponse("Forbidden", "You can only delete your own review", 403);
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
