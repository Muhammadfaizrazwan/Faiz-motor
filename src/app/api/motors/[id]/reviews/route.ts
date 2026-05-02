import { type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createReviewSchema } from "@/lib/validations/review";
import { successResponse, errorResponse } from "@/lib/api-response";

/**
 * GET /api/motors/:id/reviews
 * Get all approved reviews for a motor
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if motor exists
    const motor = await prisma.motor.findUnique({ where: { id } });
    if (!motor) {
      return errorResponse("Motor not found", "Motor not found", 404);
    }

    const reviews = await prisma.review.findMany({
      where: {
        motorId: id,
        status: "APPROVED",
      },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate average rating
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    return successResponse(
      {
        reviews,
        averageRating: Math.round(avgRating * 10) / 10,
        totalReviews: reviews.length,
      },
      "Reviews retrieved"
    );
  } catch (error) {
    console.error("Get reviews error:", error);
    return errorResponse(
      "Internal server error",
      "Failed to retrieve reviews",
      500
    );
  }
}

/**
 * POST /api/motors/:id/reviews
 * Submit a review (login required)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return errorResponse("Unauthorized", "Authentication required", 401);
    }

    const { id } = await params;

    // Check if motor exists
    const motor = await prisma.motor.findUnique({ where: { id } });
    if (!motor) {
      return errorResponse("Motor not found", "Motor not found", 404);
    }

    const body = await request.json();
    const parsed = createReviewSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(
        JSON.stringify(parsed.error.flatten().fieldErrors),
        "Validation failed",
        400
      );
    }

    // Check if user already reviewed this motor
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: session.user.id,
        motorId: id,
      },
    });

    if (existingReview) {
      return errorResponse(
        "Already reviewed",
        "You have already submitted a review for this motor",
        409
      );
    }

    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        motorId: id,
        rating: parsed.data.rating,
        comment: parsed.data.comment,
        status: "PENDING",
      },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });

    return successResponse(
      review,
      "Review submitted successfully. Pending approval.",
      201
    );
  } catch (error) {
    console.error("Submit review error:", error);
    return errorResponse(
      "Internal server error",
      "Failed to submit review",
      500
    );
  }
}
