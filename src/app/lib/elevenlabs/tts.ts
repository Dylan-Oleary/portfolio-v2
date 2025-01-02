import { ElevenLabsClient } from "elevenlabs";

export type GenerateSpeechFromTextOpts = {
  text: string;
};

export async function generateSpeechFromText({
  text,
}: GenerateSpeechFromTextOpts) {
  const client = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY,
  });

  return client.textToSpeech.convert("JBFqnCBsd6RMkjVDRZzb", {
    model_id: "eleven_flash_v2",
    output_format: "mp3_22050_32",
    text,
  });
}
