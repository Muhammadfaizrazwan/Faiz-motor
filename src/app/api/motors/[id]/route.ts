import { type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { updateMotorSchema } from "@/lib/validations/motor";
import { successResponse, errorResponse } from "@/lib/api-response";
import { deleteFromCloudinary } from "@/lib/cloudinary";

/**
 * GET /api/motors/:id
 * Get motor detail and increment viewCount
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const motor = await prisma.motor.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
      include: {
        photos: {
          orderBy: { isPrimary: "desc" },
        },
        reviews: {
          where: { status: "APPROVED" },
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        _count: {
          select: {
            reviews: { where: { status: "APPROVED" } },
            savedByUsers: true,
          },
        },
      },
    });

    return successResponse(motor, "Motor detail retrieved");
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2025"
    ) {
      return errorResponse("Motor not found", "Motor not found", 404);
    }
    console.error("Get motor detail error:", error);
    return errorResponse(
      "Internal server error",
      "Failed to retrieve motor",
      500
    );
  }
}

/**
 * PUT /api/motors/:id
 * Update motor (ADMIN only)
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
    if (session.user.role !== "ADMIN") {
      return errorResponse("Forbidden", "Admin access required", 403);
    }

    const { id } = await params;
    const body = await request.json();

    const parsed = updateMotorSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(
        JSON.stringify(parsed.error.flatten().fieldErrors),
        "Validation failed",
        400
      );
    }

    // Check if motor exists
    const existing = await prisma.motor.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse("Motor not found", "Motor not found", 404);
    }

    const motor = await prisma.motor.update({
      where: { id },
      data: parsed.data,
      include: {
        photos: true,
      },
    });

    return successResponse(motor, "Motor updated successfully");
  } catch (error) {
    console.error("Update motor error:", error);
    return errorResponse(
      "Internal server error",
      "Failed to update motor",
      500
    );
  }
}

/**
 * DELETE /api/motors/:id
 * Delete motor and cascade delete photos from Cloudinary (ADMIN only)
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

    // Get motor with photos to delete from Cloudinary
    const motor = await prisma.motor.findUnique({
      where: { id },
      include: { photos: true },
    });

    if (!motor) {
      return errorResponse("Motor not found", "Motor not found", 404);
    }

    // Delete photos from Cloudinary
    const deletePromises = motor.photos.map((photo) =>
      deleteFromCloudinary(photo.publicId)
    );
    await Promise.allSettled(deletePromises);

    // Delete motor (cascade will delete photos, reviews, saved records)
    await prisma.motor.delete({ where: { id } });

    return successResponse(null, "Motor deleted successfully");
  } catch (error) {
    console.error("Delete motor error:", error);
    return errorResponse(
      "Internal server error",
      "Failed to delete motor",
      500
    );
  }
}
