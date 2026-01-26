import { useState } from "react";
import astronaut from "../../assets/astronaut.png";

import ChatSidebar from "./ChatSidebar";
import ChatMessages from "./ChatMessages";
import ChatHeader from "./ChatHeader";
import ChatComposer from "./ChatComposer";

import type { Conversation, Message } from "./ChatTypes";
import { conversations as initialData } from "./FakeData";

export default function ChatPage() {
  const [conversations, setConversations] =
    useState<Conversation[]>(initialData);

  const [activeId, setActiveId] = useState<string>(
    initialData[0]?.id ?? ""
  );

  const activeConversation = conversations.find(
    (c) => c.id === activeId
  );

  const handleSend = (text: string) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? {
              ...c,
              messages: [
                ...c.messages,
                {
                  id: Date.now().toString(),
                  senderId: "user-1",
                  text,
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : c
      )
    );
  };

  if (!activeConversation) return null;

  return (
        <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0" />

    <div>
          <img
            src={astronaut}
            className="
              absolute 
              right-[9%] 
              top-[58%]
              w-[260px]
              animate-float-rotate
              z-[0]]
            "
          />
          </div>
    <div
      className="
        w-[60vw]
        min-w-[900px]
        h-[70vh]
        flex
        rounded-[32px]
        border border-white/15
        bg-white/5
        backdrop-blur-2xl
        shadow-[0_40px_120px_rgba(0,0,0,0.8)]
        overflow-hidden
        animate-float-slow
        text-white
      "
    >
      {/* ========== SIDEBAR ========== */}
      <ChatSidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={setActiveId}
      />

      {/* ========== CHAT PANEL ========== */}
      <div className="flex flex-col flex-1 h-full">
        <ChatHeader user={activeConversation.participant} />
        <ChatMessages messages={activeConversation.messages} />
        <ChatComposer onSend={handleSend} />
      </div>
    </div>
    </section>
  );
}
