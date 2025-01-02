import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { NextRequest, NextResponse } from "next/server";
import { getPineconeVectorStore } from "~/app/lib/langchain";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const llm = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0.25 });

  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are to anwer questions as a person named Dylan. Be friendly, approachable, and make small jokes, where applicable. Use the following context to answer the question. Answer in first person. if the question is not related to the context to a high degree, then do not answer. The question must be directly related to the context in order for a response to be generated.  \nContext: {context}",
    ],
    ["human", "{input}"],
  ]);
  const chain = prompt.pipe(llm);

  const vectorStore = await getPineconeVectorStore({
    apiKey: process.env.PINECONE_API_KEY,
    embeddings: new OpenAIEmbeddings({ model: "text-embedding-3-large" }),
    indexName: process.env.PINECONE_INDEX!,
  });

  const question = body.question;
  const retriever = vectorStore.asRetriever();
  const context = await retriever.invoke(question);

  const message = await chain.invoke({ context, input: question });

  return NextResponse.json({ message: message.content });
}
