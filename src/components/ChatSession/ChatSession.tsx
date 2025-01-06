"use client";

import { useChat } from "~/hooks";

export function ChatSession() {
  const { input, messages, onSubmit, setInput } = useChat();

  return (
    <div className="w-full flex-grow flex flex-col">
      <div className="flex-grow">
        {messages.map(({ id, role, message }) => (
          <div
            key={id}
            className={`${role === "user" ? "text-end p-8" : "p-8"}`}
          >
            <div className="text-blue-300 mb-8">{role}</div>
            <div>{message}</div>
          </div>
        ))}
      </div>
      <form className="flex gap-4" onSubmit={onSubmit}>
        <input
          className="text-black w-full p-2 flex-grow"
          onChange={(event) => setInput(event.target.value)}
          type="text"
          value={input}
        />
        <button className="bg-blue-400 p-4" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}
