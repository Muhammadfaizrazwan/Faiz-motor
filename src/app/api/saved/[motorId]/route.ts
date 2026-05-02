import { type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-response";

/**
 * DELETE /api/saved/:motorId
 * Remove a motor from the user's saved list
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ motorId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return errorResponse("Unauthorized", "Authentication required", 401);
    }

    const { motorId } = await params;

    const existing = await prisma.savedMotor.findUnique({
      where: {
        userId_motorId: {
          userId: session.user.id,
          motorId,
        },
      },
    });

    if (!existing) {
      return errorResponse(
        "Not found",
        "Motor is not in your saved list",
        404
      );
    }

    await prisma.savedMotor.delete({
      where: {
        userId_motorId: {
          userId: session.user.id,
          motorId,
        },
      },
    });

    return successResponse(null, "Motor removed from saved list");
  } catch (error) {
    console.error("Remove saved motor error:", error);
    return errorResponse(
      "Internal server error",
      "Failed to remove saved motor",
      500
    );
  }
}
