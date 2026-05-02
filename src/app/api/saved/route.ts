import { type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-response";
import { z } from "zod";

const saveMotorSchema = z.object({
  motorId: z.string().min(1, "Motor ID is required"),
});

/**
 * GET /api/saved
 * Get all saved motors for the logged-in user
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return errorResponse("Unauthorized", "Authentication required", 401);
    }

    const savedMotors = await prisma.savedMotor.findMany({
      where: { userId: session.user.id },
      include: {
        motor: {
          include: {
            photos: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return successResponse(savedMotors, "Saved motors retrieved");
  } catch (error) {
    console.error("Get saved motors error:", error);
    return errorResponse(
      "Internal server error",
      "Failed to retrieve saved motors",
      500
    );
  }
}

/**
 * POST /api/saved
 * Save a motor to the user's keranjang
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return errorResponse("Unauthorized", "Authentication required", 401);
    }

    const body = await request.json();
    const parsed = saveMotorSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(
        JSON.stringify(parsed.error.flatten().fieldErrors),
        "Validation failed",
        400
      );
    }

    const { motorId } = parsed.data;

    // Check if motor exists
    const motor = await prisma.motor.findUnique({ where: { id: motorId } });
    if (!motor) {
      return errorResponse("Motor not found", "Motor not found", 404);
    }

    // Check if already saved
    const existing = await prisma.savedMotor.findUnique({
      where: {
        userId_motorId: {
          userId: session.user.id,
          motorId,
        },
      },
    });

    if (existing) {
      return errorResponse(
        "Already saved",
        "Motor is already in your saved list",
        409
      );
    }

    const saved = await prisma.savedMotor.create({
      data: {
        userId: session.user.id,
        motorId,
      },
      include: {
        motor: {
          include: {
            photos: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        },
      },
    });

    return successResponse(saved, "Motor saved successfully", 201);
  } catch (error) {
    console.error("Save motor error:", error);
    return errorResponse(
      "Internal server error",
      "Failed to save motor",
      500
    );
  }
}
