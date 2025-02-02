import { OpenAIEmbeddings } from '@langchain/openai';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { NextResponse } from 'next/server';

import { getPineconeVectorStore } from '~/lib/langchain';

import { document1, document2, document3, document4 } from './_test-documents';

export async function GET() {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 100,
  });
  const texts = await splitter.splitDocuments([document1, document2, document3, document4]);

  const vectorStore = await getPineconeVectorStore({
    embeddings: new OpenAIEmbeddings({ model: 'text-embedding-3-large' }),
    indexName: process.env.PINECONE_INDEX!,
  });

  await vectorStore.addDocuments(texts);

  return NextResponse.json({ texts });
}

export async function PATCH() {
  const vectorStore = await getPineconeVectorStore({
    embeddings: new OpenAIEmbeddings({ model: 'text-embedding-3-large' }),
    indexName: process.env.PINECONE_INDEX!,
  });

  await vectorStore.pineconeIndex.deleteAll();

  return NextResponse.json({ status: 'ok' });
}
