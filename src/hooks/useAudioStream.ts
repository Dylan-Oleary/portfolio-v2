'use client';

import { useRef, useState } from 'react';

export type UseAudioStreamReturn = {
  audioContext: AudioContext;
  buffer?: AudioBuffer;
  streamAudio: (stream: ReadableStream<Uint8Array<ArrayBufferLike>>) => Promise<void>;
};

export function useAudioStream(): UseAudioStreamReturn {
  const audioContext = useRef<AudioContext>(
    new (window?.AudioContext || window?.webkitAudioContext)(),
  );
  const analyserNode = useRef<AnalyserNode>(audioContext.current!.createAnalyser());
  const [buffer, setBuffer] = useState<AudioBuffer | undefined>();

  const streamAudio = async (
    stream: ReadableStream<Uint8Array<ArrayBufferLike>>,
  ): Promise<void> => {
    if (!audioContext.current) return;

    analyserNode.current.fftSize = 2048;

    const reader = stream.getReader();

    if (!reader) {
      console.error('No reader');
      return;
    }

    setBuffer(undefined);

    // Read the stream into chunks
    const streamChunks: Uint8Array[] = [];
    let combinedChunksLength = 0;
    let isReaderFinished = false;

    while (!isReaderFinished) {
      const { value, done } = await reader.read();

      if (value) {
        streamChunks.push(value);
        combinedChunksLength += value.length;
      }

      isReaderFinished = done;
    }

    // Combine the chunks into a single Uint8Array
    const combinedChunks = new Uint8Array(combinedChunksLength);
    let chunkOffset = 0;

    for (const chunk of streamChunks) {
      combinedChunks.set(chunk, chunkOffset);
      chunkOffset += chunk.length;
    }

    // Decode the audio data
    try {
      const audioBuffer = await audioContext.current.decodeAudioData(combinedChunks.buffer);
      //   const source = audioContext.current.createBufferSource();

      setBuffer(audioBuffer);
    } catch (error) {
      console.error('Error decoding audio data:', error);
    }
  };

  return { audioContext: audioContext.current, buffer, streamAudio };
}
