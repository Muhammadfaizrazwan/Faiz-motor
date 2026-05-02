import { type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { successResponse, errorResponse } from "@/lib/api-response";

/**
 * DELETE /api/photos/:photoId
 * Delete a photo from Cloudinary and database (ADMIN only)
 */
export async function DELETE(
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

    // Delete from Cloudinary
    await deleteFromCloudinary(photo.publicId);

    // Delete from database
    await prisma.motorPhoto.delete({ where: { id: photoId } });

    // If deleted photo was primary, set another photo as primary
    if (photo.isPrimary) {
      const nextPhoto = await prisma.motorPhoto.findFirst({
        where: { motorId: photo.motorId },
        orderBy: { createdAt: "asc" },
      });
      if (nextPhoto) {
        await prisma.motorPhoto.update({
          where: { id: nextPhoto.id },
          data: { isPrimary: true },
        });
      }
    }

    return successResponse(null, "Photo deleted successfully");
  } catch (error) {
    console.error("Delete photo error:", error);
    return errorResponse(
      "Internal server error",
      "Failed to delete photo",
      500
    );
  }
}
