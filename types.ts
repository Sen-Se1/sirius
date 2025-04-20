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

export type Notification = {
  id: string;
  message: string;
  isRead: boolean;
}