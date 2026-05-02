import { z } from "zod";

export const createMotorSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(200, "Name must be at most 200 characters"),
  brand: z
    .string()
    .min(1, "Brand is required")
    .max(100, "Brand must be at most 100 characters"),
  year: z
    .number()
    .int()
    .min(1900, "Year must be at least 1900")
    .max(new Date().getFullYear() + 1, "Year cannot be in the future"),
  color: z
    .string()
    .min(1, "Color is required")
    .max(50, "Color must be at most 50 characters"),
  condition: z.enum(["BARU", "BEKAS"], {
    error: "Condition must be BARU or BEKAS",
  }),
  price: z
    .number()
    .positive("Price must be a positive number"),
  description: z
    .string()
    .max(2000, "Description must be at most 2000 characters")
    .optional()
    .nullable(),
});

export const updateMotorSchema = createMotorSchema.partial();

export const motorStatusSchema = z.object({
  status: z.enum(["TERSEDIA", "DIPESAN", "TERJUAL"], {
    error: "Status must be TERSEDIA, DIPESAN, or TERJUAL",
  }),
});

export const motorQuerySchema = z.object({
  brand: z.string().optional(),
  condition: z.enum(["BARU", "BEKAS"]).optional(),
  status: z.enum(["TERSEDIA", "DIPESAN", "TERJUAL"]).optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  year: z.coerce.number().int().optional(),
  sort: z.enum(["newest", "oldest", "price_asc", "price_desc", "popular"]).optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
});

export type CreateMotorInput = z.infer<typeof createMotorSchema>;
export type UpdateMotorInput = z.infer<typeof updateMotorSchema>;
export type MotorStatusInput = z.infer<typeof motorStatusSchema>;
export type MotorQueryInput = z.infer<typeof motorQuerySchema>;
