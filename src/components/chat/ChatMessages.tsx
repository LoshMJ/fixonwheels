import type { Message } from "./ChatTypes";
import MessageBubble from "./MessageBubble";

type Props = {
  messages: Message[];
};

export default function ChatMessages({ messages }: Props) {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
    </div>
  );
}
