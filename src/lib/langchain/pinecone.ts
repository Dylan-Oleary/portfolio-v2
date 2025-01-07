import type { EmbeddingsInterface } from '@langchain/core/embeddings';
import { PineconeStore } from '@langchain/pinecone';
import { Pinecone } from '@pinecone-database/pinecone';

export type GetPineconeVectorStoreOpts = {
  embeddings: EmbeddingsInterface;
  indexName: string;
};

export async function getPineconeVectorStore({
  embeddings,
  indexName,
}: GetPineconeVectorStoreOpts): Promise<PineconeStore> {
  const pineconeIndex = await new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  }).Index(indexName);

  return new PineconeStore(embeddings, { pineconeIndex });
}
