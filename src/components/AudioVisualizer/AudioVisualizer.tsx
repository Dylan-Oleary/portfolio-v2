'use client';

import { ReactElement, useCallback, useEffect, useRef } from 'react';

export type AudioVisualizerProps = {
  analyserNode: AnalyserNode;
};

export function AudioVisualizer({ analyserNode }: AudioVisualizerProps): ReactElement {
  const canvas = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const ctx = canvas.current?.getContext('2d');
    if (!ctx) return;

    requestAnimationFrame(draw);

    const bufferLength = analyserNode.fftSize;
    const dataArray = new Uint8Array(bufferLength);
    analyserNode.getByteTimeDomainData(dataArray);

    ctx.fillRect(0, 0, canvas.current!.width, canvas.current!.height);
    ctx.fillStyle = '#0A0A0A';

    ctx.lineWidth = 1;
    ctx.strokeStyle = '#fff';

    ctx.beginPath();

    const sliceWidth = canvas.current!.width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0; // Normalize the byte value
      const y = (v * canvas.current!.height) / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    // Draw Line End-To-End
    ctx.lineTo(canvas.current!.width, canvas.current!.height / 2);
    // Plot the values
    ctx.stroke();
  }, [analyserNode]);

  useEffect(() => {
    if (analyserNode) draw();
  }, [analyserNode, draw]);

  return <canvas className="w-full" ref={canvas} />;
}
