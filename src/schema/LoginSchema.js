import z from "zod";
import { _email } from "zod/v4/core";

const loginSchema = z.object({
  email: z.email("Invalid email address").nonempty("Email is required"),

  password: z
    .string()
    .nonempty("Password is required")
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must include uppercase, lowercase, number & symbol"
    ),
});

export default loginSchema;
