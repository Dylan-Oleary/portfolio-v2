import {
  type Dispatch,
  type FormEvent,
  type SetStateAction,
  useState,
} from "react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  message: string;
};

export type UseChatReturn = {
  input: string;
  messages: ChatMessage[];
  setInput: Dispatch<SetStateAction<string>>;
  onSubmit: (event?: FormEvent) => Promise<void>;
};

export function useChat(): UseChatReturn {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: self.crypto.randomUUID(),
      role: "assistant",
      message: "Hello! How can I help you today?",
    },
  ]);

  const onSubmit = async (event?: FormEvent) => {
    event?.stopPropagation();
    event?.preventDefault();

    const updatedMessages: ChatMessage[] = [
      ...messages,
      { id: self.crypto.randomUUID(), role: "user", message: input },
    ];

    setMessages(updatedMessages);

    const response = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ question: input }),
    });

    const reader = response.body?.getReader();

    if (!reader) {
      console.error("Failed to get reader from response body");
      return;
    }

    const chatMessage: ChatMessage = {
      id: self.crypto.randomUUID(),
      role: "assistant",
      message: "",
    };
    const decoder = new TextDecoder();
    let isReaderFinished = false;

    while (!isReaderFinished) {
      const { value, done } = await reader.read();

      if (value) {
        chatMessage.message += decoder.decode(value);
        setMessages([...updatedMessages, chatMessage]);
      }

      isReaderFinished = done;
    }
  };

  return { input, messages, onSubmit, setInput };
}
