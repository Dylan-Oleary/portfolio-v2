import { type Dispatch, type FormEvent, type SetStateAction, useState } from 'react';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  message: string;
};

export type UseChatReturn = {
  input: string;
  messages: ChatMessage[];
  setInput: Dispatch<SetStateAction<string>>;
  onSubmit: (event?: FormEvent) => Promise<void>;
};

export function useChat(): UseChatReturn {
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const onSubmit = async (event?: FormEvent) => {
    event?.stopPropagation();
    event?.preventDefault();

    const updatedMessages: ChatMessage[] = [
      ...messages,
      { id: self.crypto.randomUUID(), role: 'user', message: input },
    ];

    setMessages(updatedMessages);

    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ question: input }),
    });

    const reader = response.body?.getReader();

    if (!reader) {
      console.error('Failed to get reader from response body');
      return;
    }

    const decoder = new TextDecoder();

    let buffer = ''; // Stores incomplete JSON strings
    let isReaderFinished = false;
    let newMessage = { message: '' } as ChatMessage;

    while (!isReaderFinished) {
      const { value, done } = await reader.read();

      if (value) {
        // Step 1: Decode the value
        const decodedValue = decoder.decode(value);

        // Step 2: Append the decoded value to the buffer
        buffer += decodedValue;

        // Step 3: Split the buffer into parts
        //// Full JSON strings are separated by newlines
        const jsonParts = buffer.split('\n');

        // Step 4: Store the last JSON part in the buffer, in the event that it is incomplete
        buffer = jsonParts.pop() ?? '';

        for (const part of jsonParts) {
          if (part.trim()) {
            try {
              const json = JSON.parse(part);

              // Step 5A: If the JSON is a metadata object, store the ID and role
              if (json.type === 'metadata') {
                newMessage = { ...newMessage, id: json.id, role: json.role };
              } else if (json.type === 'message') {
                // Step 5B: If the JSON is a message object, append the message to the current message
                newMessage.message += json.message;
              }
            } catch (error) {
              console.error('Failed to parse JSON:', part, error);
            }
          }
        }
      }

      isReaderFinished = done;
      setMessages([...updatedMessages, newMessage]);
    }

    // Step 6: Process remaining buffer after the reader is closed
    if (buffer.trim()) {
      try {
        const json = JSON.parse(buffer);

        if (json.type === 'metadata') {
          newMessage = { ...newMessage, id: json.id, role: json.role };
        } else if (json.type === 'message') {
          newMessage.message += json.message;
        }

        setMessages([...updatedMessages, newMessage]);
      } catch (error) {
        console.error('Failed to parse remaining buffer:', buffer, error);
      }
    }
  };

  return { input, messages, onSubmit, setInput };
}
