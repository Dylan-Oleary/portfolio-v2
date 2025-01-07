'use client';

import { type FormEvent, useState } from 'react';

import { useAudioStream } from '~/hooks';

export function TextToSpeechForm() {
  const { streamAudio } = useAudioStream();
  const [question, setQuestion] = useState<string>('');

  const onSubmit = async (event: FormEvent) => {
    event?.preventDefault();
    event?.stopPropagation();

    setQuestion('');

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
    <form className="w-[450px] mt-8" onSubmit={onSubmit}>
      <input
        className="text-black p-4 w-full"
        name="question"
        onChange={(event) => setQuestion(event.target.value)}
        type="text"
        value={question}
      />
      <button className="bg-blue-400 p-4 mt-4 w-full" type="submit">
        Submit
      </button>
    </form>
  );
}
