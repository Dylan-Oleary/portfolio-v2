import { createReadStream } from "fs";
import path from "path";

import { getElevenLabsClient } from "./client";
import { ElevenLabsAudioOutputFormat } from "./types";

export type GenerateSpeechStreamFromTextOpts = {
  modelId?: string;
  outputFormat?: ElevenLabsAudioOutputFormat;
  text: string;
  voiceId?: string;
};

export async function generateSpeechStreamFromText({
  modelId = "eleven_flash_v2",
  outputFormat = ElevenLabsAudioOutputFormat.MP3_22050_32,
  text,
  voiceId = "JBFqnCBsd6RMkjVDRZzb",
}: GenerateSpeechStreamFromTextOpts) {
  if (process.env.FEATURE_ENABLE_ELEVENLABS_API !== "1") {
    return createReadStream(
      path.join(process.cwd(), "/src/server/_resources/_mock-tts-response.mp3")
    );
  }

  return getElevenLabsClient().textToSpeech.convertAsStream(voiceId, {
    model_id: modelId,
    output_format: outputFormat,
    text,
  });
}
