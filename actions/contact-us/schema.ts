import { z } from "zod";

export const ContactUs = z.object({
  name: z.string().min(2, {
    message: "The name must be at least 2 characters long.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  message: z.string().min(10, {
    message: "The message must be at least 10 characters long.",
  }),
});
