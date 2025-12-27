import { z } from "zod";

const createCourseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),

  description: z.string().min(10, "Description must be at least 10 characters"),

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

  thumbnail: z
    .any()
    .refine(
      (files) => files instanceof FileList && files.length === 1,
      "Thumbnail is required"
    ),

  videos: z
    .any()
    .refine(
      (files) => files instanceof FileList && files.length > 0,
      "At least one video is required"
    ),
});

export default createCourseSchema;
