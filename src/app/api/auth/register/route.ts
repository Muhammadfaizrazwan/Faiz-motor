import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";
import { successResponse, errorResponse } from "@/lib/api-response";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIp(request);
    const limiter = rateLimit(`register:${ip}`);
    if (!limiter.success) {
      return errorResponse(
        "Too many requests",
        "Please try again later",
        429
      );
    }

    const body = await request.json();

    // Validate input
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return errorResponse(
        JSON.stringify(errors),
        "Validation failed",
        400
      );
    }

    const { name, email, password, phone } = parsed.data;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return errorResponse(
        "Email already registered",
        "Email already registered",
        409
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        role: "USER",
        status: "ACTIVE",
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    return successResponse(user, "User registered successfully", 201);
  } catch (error) {
    console.error("Register error:", error);
    return errorResponse(
      "Internal server error",
      "Failed to register user",
      500
    );
  }
}
