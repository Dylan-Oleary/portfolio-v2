declare namespace NodeJS {
  interface ProcessEnv {
    ELEVENLABS_API_KEY: string;
    OPENAI_API_KEY: string;
    PINECONE_API_KEY: string;
    PINECONE_INDEX_NAME: string;
  }
}
