import type { Conversation, Message, User } from "./ChatTypes";
import Me from "../../assets/me.png"
export const currentUserId = "user-1";

export const conversations: Conversation[] = [
  {
    id: "c1",
    participant: {
      id: "tech-1",
      name: "Losh",
      avatar: Me,
      online: true,
    },
    messages: [
      {
        id: "m1",
        senderId: "tech-1",
        text: "Hi! I’m your technician.",
        createdAt: new Date().toISOString(),
      },
    ],
    unreadCount: 0,
  },
];
