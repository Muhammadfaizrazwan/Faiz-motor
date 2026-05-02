import { NextResponse } from "next/server";

/**
 * Standardized success response
 */
export function successResponse<T>(
  data: T,
  message: string = "Success",
  status: number = 200
) {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status }
  );
}

/**
 * Standardized error response
 */
export function errorResponse(
  error: string,
  message: string = "An error occurred",
  status: number = 500
) {
  return NextResponse.json(
    {
      success: false,
      error,
      message,
    },
    { status }
  );
}

/**
 * Standardized paginated response
 */
export function paginatedResponse<T>(
  data: T[],
  meta: {
    page: number;
    limit: number;
    total: number;
  },
  message: string = "Success"
) {
  return NextResponse.json(
    {
      success: true,
      data,
      meta: {
        ...meta,
        totalPages: Math.ceil(meta.total / meta.limit),
      },
      message,
    },
    { status: 200 }
  );
}
