export type User = {
  id: string;
  name: string;
  avatar: string;
  online?: boolean;
};

export type Message = {
  id: string;
  senderId: string;
  text?: string;
  image?: string;
  createdAt: string;
};

export type Conversation = {
  id: string;
  participant: User;
  messages: Message[];
  unreadCount: number;
};
