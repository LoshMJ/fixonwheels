import type { User } from "./ChatTypes";

type Props = {
  user: User;
};

export default function ChatHeader({ user }: Props) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
      <div className="flex items-center gap-3">
        <img
          src={user.avatar}
          alt={user.name}
          className="h-10 w-10 rounded-full"
        />
        <div>
          <p className="text-white font-semibold">{user.name}</p>
          <p className="text-xs text-emerald-400">
            {user.online ? "Active now" : "Offline"}
          </p>
        </div>
      </div>

      <div className="flex gap-3 text-white/70">
        <button>📞</button>
        <button>📹</button>
        <button>⋮</button>
      </div>
    </div>
  );
}
