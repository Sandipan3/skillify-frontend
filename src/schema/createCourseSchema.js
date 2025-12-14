import { z } from "zod";

const createCourseSchema = z.object({
  title: z.string().min(3, "Title is required"),

  description: z.string().min(10, "Description is required"),

  price: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : undefined))
    .refine((num) => num === undefined || num >= 0, {
      message: "Price cannot be negative",
    }),

  upiId: z.string().optional(),

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
