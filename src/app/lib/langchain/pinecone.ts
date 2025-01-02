import type { EmbeddingsInterface } from "@langchain/core/embeddings";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";

export type GetPineconeVectorStoreOpts = {
  apiKey: string;
  embeddings: EmbeddingsInterface;
  indexName: string;
};

export async function getPineconeVectorStore({
  apiKey,
  embeddings,
  indexName,
}: GetPineconeVectorStoreOpts): Promise<PineconeStore> {
  return new PineconeStore(embeddings, {
    pineconeIndex: await new Pinecone({ apiKey }).Index(indexName),
  });
}
