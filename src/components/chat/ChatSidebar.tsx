import type { Conversation } from "./ChatTypes";
import ConversationRow from "./ConversationRow";

type Props = {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
};

export default function ChatSidebar({
  conversations,
  activeId,
  onSelect,
}: Props) {
  return (
    <aside className="w-full md:w-80 border-r border-white/10 bg-black/40 backdrop-blur-xl p-3">
      <h2 className="text-xs uppercase tracking-[0.2em] text-white/50 px-3 mb-3">
        Conversations
      </h2>

      <div className="flex flex-col gap-1">
        {conversations.map((conv) => (
          <ConversationRow
            key={conv.id}
            conversation={conv}
            active={conv.id === activeId}
            onClick={() => onSelect(conv.id)}
          />
        ))}
      </div>
    </aside>
  );
}
