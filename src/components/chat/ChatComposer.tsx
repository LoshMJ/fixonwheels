import { useState } from "react";

type Props = {
  onSend: (text: string) => void;
};

export default function ChatComposer({ onSend }: Props) {
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="px-6 py-4 border-t border-white/10 flex gap-3">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 rounded-full bg-white/5 border border-white/10 px-4 py-2 text-sm text-white outline-none"
      />
      <button
        onClick={send}
        className="px-4 py-2 rounded-full bg-purple-600 text-white text-sm"
      >
        Send
      </button>
    </div>
  );
}
