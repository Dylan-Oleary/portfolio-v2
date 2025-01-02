import { ElevenLabsClient } from "elevenlabs";

export type GenerateSpeechFromTextOpts = {
  apiKey: string;
  text: string;
};

export async function generateSpeechFromText({
  apiKey,
  text,
}: GenerateSpeechFromTextOpts) {
  const client = new ElevenLabsClient({ apiKey });

  return client.textToSpeech.convert("JBFqnCBsd6RMkjVDRZzb", {
    model_id: "eleven_flash_v2",
    output_format: "mp3_22050_32",
    text,
  });
}
