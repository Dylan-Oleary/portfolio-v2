import { ChatSession } from "../components/ChatSession";

export default function ChatPage() {
  return (
    <div className="min-h-screen flex flex-col p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col flex-grow justify-center w-full">
        <ChatSession />
      </main>
    </div>
  );
}
