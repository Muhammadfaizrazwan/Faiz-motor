import { type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-response";

/**
 * PATCH /api/photos/:photoId/primary
 * Set a photo as the primary photo for its motor (ADMIN only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ photoId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return errorResponse("Unauthorized", "Authentication required", 401);
    }
    if (session.user.role !== "ADMIN") {
      return errorResponse("Forbidden", "Admin access required", 403);
    }

    const { photoId } = await params;

    const photo = await prisma.motorPhoto.findUnique({
      where: { id: photoId },
    });

    if (!photo) {
      return errorResponse("Photo not found", "Photo not found", 404);
    }

    // Unset all other photos as primary for this motor
    await prisma.motorPhoto.updateMany({
      where: { motorId: photo.motorId, isPrimary: true },
      data: { isPrimary: false },
    });

    // Set this photo as primary
    const updatedPhoto = await prisma.motorPhoto.update({
      where: { id: photoId },
      data: { isPrimary: true },
    });

    return successResponse(updatedPhoto, "Photo set as primary");
  } catch (error) {
    console.error("Set primary photo error:", error);
    return errorResponse(
      "Internal server error",
      "Failed to set primary photo",
      500
    );
  }
}
