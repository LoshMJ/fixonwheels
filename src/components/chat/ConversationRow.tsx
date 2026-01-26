import type{ Conversation } from "./ChatTypes";

type Props = {
  conversation: Conversation;
  active: boolean;
  onClick: () => void;
};

export default function ConversationRow({
  conversation,
  active,
  onClick,
}: Props) {
  const { participant, unreadCount } = conversation;

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition
        ${active ? "bg-purple-600/20" : "hover:bg-white/5"}`}
    >
      <div className="relative">
        <img
          src={participant.avatar}
          alt={participant.name}
          className="h-10 w-10 rounded-full"
        />
        {participant.online && (
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-400 rounded-full border border-black" />
        )}
      </div>

      <div className="flex-1 text-left">
        <p className="text-sm font-semibold text-white">
          {participant.name}
        </p>
        <p className="text-xs text-white/50 truncate">
          Tap to chat
        </p>
      </div>

      {unreadCount > 0 && (
        <span className="h-5 w-5 rounded-full bg-purple-600 text-xs text-white flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </button>
  );
}
