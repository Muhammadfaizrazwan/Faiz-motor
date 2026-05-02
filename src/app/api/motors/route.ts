import { type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createMotorSchema, motorQuerySchema } from "@/lib/validations/motor";
import {
  successResponse,
  errorResponse,
  paginatedResponse,
} from "@/lib/api-response";
import { Prisma } from "@prisma/client/index";

/**
 * GET /api/motors
 * Get all motors with filtering, sorting, and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryObj: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      queryObj[key] = value;
    });

    const parsed = motorQuerySchema.safeParse(queryObj);
    if (!parsed.success) {
      return errorResponse(
        JSON.stringify(parsed.error.flatten().fieldErrors),
        "Invalid query parameters",
        400
      );
    }

    const { brand, condition, status, minPrice, maxPrice, year, sort, page, limit } =
      parsed.data;

    // Build where clause
    const where: Prisma.MotorWhereInput = {};

    if (brand) {
      where.brand = { contains: brand };
    }
    if (condition) {
      where.condition = condition;
    }
    if (status) {
      where.status = status;
    }
    if (year) {
      where.year = year;
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    // Build orderBy
    let orderBy: Prisma.MotorOrderByWithRelationInput = { createdAt: "desc" };
    switch (sort) {
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "price_asc":
        orderBy = { price: "asc" };
        break;
      case "price_desc":
        orderBy = { price: "desc" };
        break;
      case "popular":
        orderBy = { viewCount: "desc" };
        break;
      case "newest":
      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    const skip = (page - 1) * limit;

    const [motors, total] = await Promise.all([
      prisma.motor.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          photos: {
            where: { isPrimary: true },
            take: 1,
          },
          _count: {
            select: {
              reviews: { where: { status: "APPROVED" } },
              savedByUsers: true,
            },
          },
        },
      }),
      prisma.motor.count({ where }),
    ]);

    return paginatedResponse(motors, { page, limit, total }, "Motors retrieved");
  } catch (error) {
    console.error("Get motors error:", error);
    return errorResponse(
      "Internal server error",
      "Failed to retrieve motors",
      500
    );
  }
}

/**
 * POST /api/motors
 * Create a new motor (ADMIN only)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return errorResponse("Unauthorized", "Authentication required", 401);
    }
    if (session.user.role !== "ADMIN") {
      return errorResponse("Forbidden", "Admin access required", 403);
    }

    const body = await request.json();
    const parsed = createMotorSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(
        JSON.stringify(parsed.error.flatten().fieldErrors),
        "Validation failed",
        400
      );
    }

    const motor = await prisma.motor.create({
      data: parsed.data,
      include: {
        photos: true,
      },
    });

    return successResponse(motor, "Motor created successfully", 201);
  } catch (error) {
    console.error("Create motor error:", error);
    return errorResponse(
      "Internal server error",
      "Failed to create motor",
      500
    );
  }
}
