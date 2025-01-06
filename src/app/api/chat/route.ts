import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from "@langchain/core/prompts";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { randomUUID } from "crypto";
import type { NextRequest } from "next/server";
import { getPineconeVectorStore } from "~/app/lib";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const question = body.question;

  const llm = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0.1,
    streaming: true,
  });
  const prompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
      `You are to answer questions as a person named Dylan.
         Assume you are being interviewed for a job and answer the questions courteously and professionally.
         Your knowledge is limited only to the context provided.
         Do not be overly creative.`
    ),
    SystemMessagePromptTemplate.fromTemplate("Context: {context}"),
    HumanMessagePromptTemplate.fromTemplate("{question}"),
  ]);

  const vectorStore = await getPineconeVectorStore({
    embeddings: new OpenAIEmbeddings({ model: "text-embedding-3-large" }),
    indexName: process.env.PINECONE_INDEX!,
  });
  const retriever = vectorStore.asRetriever({ k: 5 });
  const context = await retriever.invoke(question);
  const message = await prompt.pipe(llm).stream({ context, question });

  return new Response(
    new ReadableStream({
      async start(controller) {
        try {
          controller.enqueue(
            JSON.stringify({
              id: randomUUID(),
              role: "assistant",
              type: "metadata",
            }) + "\n"
          );

          for await (const chunk of message) {
            controller.enqueue(
              JSON.stringify({ type: "message", message: chunk.content }) + "\n"
            );
          }
        } catch (error) {
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    }),
    {
      headers: new Headers({
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      }),
    }
  );
}
