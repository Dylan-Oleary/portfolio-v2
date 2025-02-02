'use client';

import { ReactElement } from 'react';

import { useAudioStream } from '~/hooks';

import { AudioVisualizer } from '../AudioVisualizer';
import { TextToSpeechForm } from '../TextToSpeechForm';

export function AudioResponder(): ReactElement {
  const { audioBuffer, handleAudioStream } = useAudioStream();

  const onFormSubmit = async (question: string) => {
    const response = await fetch('/api/tts', {
      body: JSON.stringify({ question }),
      method: 'POST',
    });

    if (!response.ok) {
      console.error('Failed to fetch');
      return;
    }

    handleAudioStream(response.body!);
  };

  return (
    <div className="flex flex-col flex-grow">
      <AudioVisualizer buffer={audioBuffer} />
      <div>
        <TextToSpeechForm onSubmit={onFormSubmit} />
      </div>
    </div>
  );
}
