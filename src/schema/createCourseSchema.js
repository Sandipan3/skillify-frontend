import { z } from "zod";

const createCourseSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Description is required"),
  price: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : 0))
    .refine((num) => num >= 0, {
      message: "Price cannot be negative",
    }),
  thumbnail: z
    .instanceof(FileList)
    .refine((files) => files.length === 1, "Thumbnail is required"),

  videos: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "At least one video is required"),
});

export default createCourseSchema;
