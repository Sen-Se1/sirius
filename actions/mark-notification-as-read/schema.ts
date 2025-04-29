import { z } from "zod";

export const MarkNotificationAsReadSchema = z.object({
  notificationId: z.string(),
});