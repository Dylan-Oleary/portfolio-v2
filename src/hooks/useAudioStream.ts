'use client';

import { useRef, useState } from 'react';

export type UseAudioStreamReturn = {
  audioBuffer: AudioBuffer | undefined;
  audioContext: AudioContext;
  handleAudioStream: (stream: ReadableStream<Uint8Array<ArrayBufferLike>>) => Promise<void>;
};

export function useAudioStream(): UseAudioStreamReturn {
  const audioContext = useRef<AudioContext>(
    typeof window === 'undefined'
      ? null
      : new (window?.AudioContext || window?.webkitAudioContext)(),
  );
  const analyserNode = useRef<AnalyserNode>(audioContext.current?.createAnalyser() ?? null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer>();

  const handleAudioStream = async (
    stream: ReadableStream<Uint8Array<ArrayBufferLike>>,
  ): Promise<void> => {
    if (!audioContext.current || !analyserNode.current) return;
    setAudioBuffer(undefined);

    analyserNode.current.fftSize = 2048;

    const reader = stream.getReader();

    if (!reader) {
      console.error('No reader');
      return;
    }

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

      setAudioBuffer(audioBuffer);
    } catch (error) {
      console.error('Error decoding audio data:', error);
    }
  };

  return { audioBuffer, audioContext: audioContext.current!, handleAudioStream };
}
