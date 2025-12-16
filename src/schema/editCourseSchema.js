import { z } from "zod";

const editCourseSchema = z.object({
  title: z.string().min(3, "Title is required"),

  description: z.string().min(10, "Description is required"),

  price: z.string(),

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
