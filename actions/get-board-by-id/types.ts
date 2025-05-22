import { z } from "zod";
import { GetBoardById } from "./schema";
import { ActionState } from "@/lib/create-safe-action";

export type InputType = z.infer<typeof GetBoardById>;

export type ReturnType = ActionState<
  InputType,
  {
    id: string;
    title: string;
    imageFullUrl: string | null;
    orgId: string;
    createdAt: Date;
  }
>;