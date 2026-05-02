import { type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-response";
import { z } from "zod";

const userStatusSchema = z.object({
  status: z.enum(["ACTIVE", "BLOCKED"], {
    error: "Status must be ACTIVE or BLOCKED",
  }),
});

/**
 * PATCH /api/users/:id/status
 * Block or activate a user account (ADMIN only)
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

    const parsed = userStatusSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(
        JSON.stringify(parsed.error.flatten().fieldErrors),
        "Validation failed",
        400
      );
    }

    // Prevent admin from blocking themselves
    if (id === session.user.id) {
      return errorResponse(
        "Cannot modify own status",
        "You cannot change your own account status",
        400
      );
    }

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse("User not found", "User not found", 404);
    }

    const user = await prisma.user.update({
      where: { id },
      data: { status: parsed.data.status },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });

    return successResponse(
      user,
      `User ${parsed.data.status === "BLOCKED" ? "blocked" : "activated"} successfully`
    );
  } catch (error) {
    console.error("Update user status error:", error);
    return errorResponse(
      "Internal server error",
      "Failed to update user status",
      500
    );
  }
}
