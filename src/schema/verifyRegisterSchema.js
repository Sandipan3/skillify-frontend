import { z } from "zod";

const verifyRegisterSchema = z.object({
  otp: z
    .string()
    .nonempty("OTP is required")
    .length(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only numbers"),
});

export default verifyRegisterSchema;
