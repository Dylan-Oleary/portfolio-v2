declare module '*.mp3';

declare namespace NodeJS {
  interface ProcessEnv {
    ELEVENLABS_API_KEY: string;
    FEATURE_ENABLE_ELEVENLABS_API: string;
    NEXT_PUBLIC_ENABLE_AUDIO_VISUALIZER_DEV_TOOLS: string;
    OPENAI_API_KEY: string;
    PINECONE_API_KEY: string;
    PINECONE_INDEX_NAME: string;
  }
}

declare interface Window {
  webkitAudioContext: typeof AudioContext;
}
