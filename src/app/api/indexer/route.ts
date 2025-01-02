import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { NextResponse } from "next/server";

import { document1, document2 } from "./_test-documents";
import { getPineconeVectorStore } from "~/app/lib/langchain";

export async function GET() {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 50,
    chunkOverlap: 1,
  });
  const texts = await splitter.splitDocuments([document1, document2]);

  const vectorStore = await getPineconeVectorStore({
    apiKey: process.env.PINECONE_API_KEY,
    embeddings: new OpenAIEmbeddings({ model: "text-embedding-3-large" }),
    indexName: process.env.PINECONE_INDEX!,
  });

  await vectorStore.addDocuments(texts);

  return NextResponse.json({ texts });
}
