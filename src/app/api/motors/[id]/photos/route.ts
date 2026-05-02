import { type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { successResponse, errorResponse } from "@/lib/api-response";

/**
 * POST /api/motors/:id/photos
 * Upload photos for a motor to Cloudinary (ADMIN only)
 * Accepts multipart/form-data with field "photos" (multiple files)
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
    if (session.user.role !== "ADMIN") {
      return errorResponse("Forbidden", "Admin access required", 403);
    }

    const { id } = await params;

    // Check if motor exists
    const motor = await prisma.motor.findUnique({ where: { id } });
    if (!motor) {
      return errorResponse("Motor not found", "Motor not found", 404);
    }

    const formData = await request.formData();
    const files = formData.getAll("photos") as File[];

    if (!files || files.length === 0) {
      return errorResponse(
        "No files provided",
        "Please upload at least one photo",
        400
      );
    }

    // Validate file types
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return errorResponse(
          `Invalid file type: ${file.type}`,
          "Only JPEG, PNG, and WebP images are allowed",
          400
        );
      }
      // Max 5MB per file
      if (file.size > 5 * 1024 * 1024) {
        return errorResponse(
          "File too large",
          "Each file must be at most 5MB",
          400
        );
      }
    }

    // Check if motor already has photos to determine isPrimary
    const existingPhotos = await prisma.motorPhoto.count({
      where: { motorId: id },
    });

    const uploadedPhotos = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const buffer = Buffer.from(await file.arrayBuffer());

      const { url, publicId } = await uploadToCloudinary(
        buffer,
        `motomart/motors/${id}`
      );

      const photo = await prisma.motorPhoto.create({
        data: {
          motorId: id,
          url,
          publicId,
          isPrimary: existingPhotos === 0 && i === 0, // First photo becomes primary if no existing photos
        },
      });

      uploadedPhotos.push(photo);
    }

    return successResponse(
      uploadedPhotos,
      `${uploadedPhotos.length} photo(s) uploaded successfully`,
      201
    );
  } catch (error) {
    console.error("Upload photos error:", error);
    return errorResponse(
      "Internal server error",
      "Failed to upload photos",
      500
    );
  }
}
