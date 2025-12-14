import { z } from "zod";

const editCourseSchema = z.object({
  title: z.string().min(3, "Title is required"),

  description: z.string().min(10, "Description is required"),

  price: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : undefined))
    .refine((val) => val === undefined || val >= 0, "Price cannot be negative"),

  upiId: z.string().optional(),

  thumbnail: z.any().optional(),

  videos: z.any().optional(),
});

export default editCourseSchema;
