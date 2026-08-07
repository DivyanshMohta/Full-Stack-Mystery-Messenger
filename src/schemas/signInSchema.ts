import { z } from "zod";

export const signInSchema = z.object({
  identifier: z.string(), // Can be username, email or anything like this
  password: z.string(),
});
