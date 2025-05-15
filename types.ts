import { Card, List } from "@prisma/client";

export type ListWithCards = List & { cards: Card[] };

export type CardWithList = Card & { list: List };

export type Plan = {
  id: string;
  name: string;
  price: number;
  features: string[];
  description: string;
  maxUsers: number;
  maxWorkspaces: number;
  maxStorage: number;
};

export type EmailPayload = {
  from: string;
  to: string;
  subject: string;
  html: string;
};

export interface UIChat {
  id: string;
  recipientId: string;
  recipientFirstName: string;
  recipientLastName: string;
  recipientEmail: string;
  recipientPhoto?: string;
}

export interface UIMessage {
  id: string;
  senderId: string;
  text: string | null;
  filePath?: string | null;
  originalFileName?: string | null;
  fileType?: string | null;
  time: string;
  isFromCurrentUser: boolean;
  isPending?: boolean;
  error?: boolean;
  isRead?: boolean;
  isEditing?: boolean;
}