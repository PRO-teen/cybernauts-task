import { z } from "zod";

export const userSchema = z.object({
  username: z.string().min(1, "Username is required"),
  age: z.number().min(1, "Age is required"),
  hobbies: z.array(z.string()).optional(),
});
