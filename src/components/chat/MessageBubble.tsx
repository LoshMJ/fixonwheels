import type { Message } from "./ChatTypes";
import { currentUserId } from "./FakeData";

type Props = {
  message: Message;
};

export default function MessageBubble({ message }: Props) {
  const isMine = message.senderId === currentUserId;

  return (
    <div
      className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
        isMine
          ? "ml-auto bg-purple-600 text-white"
          : "mr-auto bg-white/10 text-white/80"
      }`}
    >
      {message.text}
    </div>
  );
}
