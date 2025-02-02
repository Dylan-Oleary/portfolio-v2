'use client';

import { PropsWithChildren, createContext, use } from 'react';

import { AudioVisualizer, ChatForm } from '~/components';
import { useAudioStream } from '~/hooks';

export type ChatProviderProps = PropsWithChildren<{ sessionId: string }>;

export type ChatContext = {
  onSendMessage: ({ question }: { question: string }) => void;
  responseAudio: AudioBuffer | undefined;
  sessionId: string;
};

export const Context = createContext<ChatContext>({} as ChatContext);

export function ChatProvider({ children, sessionId }: ChatProviderProps) {
  const { audioBuffer, handleAudioStream } = useAudioStream();

  const onSendMessage = async ({ question }: { question: string }) => {
    const response = await fetch('/api/tts', {
      body: JSON.stringify({ question }),
      method: 'POST',
    });

    if (!response.ok) {
      // TODO: Handle Error
      console.error('Failed to fetch');
      return;
    }

    handleAudioStream(response.body!);
  };

  return (
    <Context value={{ onSendMessage, responseAudio: audioBuffer, sessionId }}>
      <AudioVisualizer buffer={audioBuffer} />
      {children}
      <ChatForm onSubmit={onSendMessage} />
    </Context>
  );
}

export function useChatContext(): ChatContext {
  return use(Context);
}
