import { z } from "zod";

export const MarkNotificationRead = z.object({
  notificationId: z.string(),
});