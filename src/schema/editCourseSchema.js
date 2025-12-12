import { z } from "zod";

const editCourseSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Description is required"),

  price: z
    .number()
    .optional()
    .transform((value) => (value ? Number(value) : 0))
    .refine((val) => val >= 0, { message: "Price cannot be negative" }),

  thumbnail: z.any().optional(),
  videos: z.any().optional(),
});

export default editCourseSchema;
