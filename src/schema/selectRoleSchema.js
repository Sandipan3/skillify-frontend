import { z } from "zod";

const selectRoleSchema = z.object({
  newRole: z.enum(["student", "instructor"]),
});
export default selectRoleSchema;
