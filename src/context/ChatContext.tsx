'use client';

import { PropsWithChildren, createContext, use, useState } from 'react';

import { AudioVisualizer, ChatForm } from '~/components';
import { useAudioStream } from '~/hooks';

export type ChatProviderProps = PropsWithChildren<{ sessionId: string }>;

export type ChatContext = {
  sessionId: string;
};

export const Context = createContext<ChatContext>({} as ChatContext);

export function ChatProvider({ children, sessionId }: ChatProviderProps) {
  const { audioBuffer, handleAudioStream } = useAudioStream();
  const [isGeneratingResponse, setIsGeneratingResponse] = useState<boolean>(false);

  const onSendMessage = async ({ question }: { question: string }) => {
    setIsGeneratingResponse(true);

    const response = await fetch('/api/tts', {
      body: JSON.stringify({ question }),
      method: 'POST',
    });

    if (!response.ok) {
      // TODO: Handle Error
      console.error('Failed to fetch');
      return;
    }

    try {
      handleAudioStream(response.body!);
    } catch (error) {
      //TODO: Handle
      console.error(error);
    } finally {
      setIsGeneratingResponse(false);
    }
  };

  return (
    <Context value={{ sessionId }}>
      <AudioVisualizer
        buffer={audioBuffer}
        className="absolute top-0 left-0 right-0"
        contract={isGeneratingResponse}
      />
      {children}
      <ChatForm
        className="fixed bottom-0"
        disabled={isGeneratingResponse}
        onSubmit={onSendMessage}
      />
    </Context>
  );
}

export function useChatContext(): ChatContext {
  return use(Context);
}
