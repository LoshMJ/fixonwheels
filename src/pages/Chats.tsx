import ChatPage from "../components/chat/ChatPage";

export default function Chats() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center"
         style={{ backgroundImage: "url('/src/assets/galaxy-bg.jpg')" }}>
      <ChatPage />
    </div>
  );
}

