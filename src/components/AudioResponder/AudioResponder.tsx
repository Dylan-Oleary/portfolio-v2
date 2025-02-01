'use client';

import { ReactElement } from 'react';

import { useAudioStream } from '~/hooks';

import { AudioResponderV2 } from '../AudioResponderV2';
import { TextToSpeechForm } from '../TextToSpeechForm';

export function AudioResponder(): ReactElement {
  const { buffer, streamAudio } = useAudioStream();

  const onFormSubmit = async (question: string) => {
    const response = await fetch('/api/tts', {
      body: JSON.stringify({ question }),
      method: 'POST',
    });

    if (!response.ok) {
      console.error('Failed to fetch');
      return;
    }

    streamAudio(response.body!);
  };

  return (
    <div className="flex flex-col flex-grow">
      <AudioResponderV2 buffer={buffer} />
      <div>
        <TextToSpeechForm onSubmit={onFormSubmit} />
      </div>
    </div>
  );
}
