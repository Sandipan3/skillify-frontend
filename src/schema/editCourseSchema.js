import { z } from "zod";

const editCourseSchema = z.object({
  title: z.string().min(3, "Title is required"),

  description: z.string().min(10, "Description is required"),

  price: z.coerce
    .number({
      invalid_type_error: "Price must be a number",
    })
    .min(0, "Price cannot be negative"),

  upiId: z
    .string()
    .trim()
    .min(1, "UPI ID is required")
    .refine((val) => val.includes("@"), {
      message: "UPI ID must contain @",
    }),

  thumbnail: z.any().optional(),
  videos: z.any().optional(),
});

export default editCourseSchema;
