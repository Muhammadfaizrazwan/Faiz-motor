import { type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { motorStatusSchema } from "@/lib/validations/motor";
import { successResponse, errorResponse } from "@/lib/api-response";

/**
 * PATCH /api/motors/:id/status
 * Update motor status (ADMIN only)
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

    const parsed = motorStatusSchema.safeParse(body);
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
      data: { status: parsed.data.status },
    });

    return successResponse(motor, "Motor status updated successfully");
  } catch (error) {
    console.error("Update motor status error:", error);
    return errorResponse(
      "Internal server error",
      "Failed to update motor status",
      500
    );
  }
}
