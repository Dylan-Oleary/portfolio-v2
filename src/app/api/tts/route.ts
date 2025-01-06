import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from "@langchain/core/prompts";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import type { NextRequest } from "next/server";

import { generateSpeechStreamFromText } from "~/lib";
import { getPineconeVectorStore } from "~/lib/langchain";

// import testChatHistory from "~/server/_resources/_mock-chat-history.json";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const question = body.question;
  const tts = body.tts ?? false;

  const llm = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0.1,
    streaming: tts,
  });

  //   const summaryPrompt = ChatPromptTemplate.fromMessages([
  //     SystemMessagePromptTemplate.fromTemplate(
  //       "Summarize the following conversation as per the provided context"
  //     ),
  //     SystemMessagePromptTemplate.fromTemplate("Context: {context}"),
  //   ]);
  //   const summary = await summaryPrompt
  //     .pipe(llm)
  //     .invoke({ context: JSON.stringify(testChatHistory) });

  const prompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
      `You are to answer questions as a person named Dylan.
         Assume you are being interviewed for a job and answer the questions bluntly.
         Your knowledge is limited only to the context provided.
         Do not be overly verbose or overly creative.`
    ),
    SystemMessagePromptTemplate.fromTemplate("Context: {context}"),
    // SystemMessagePromptTemplate.fromTemplate("Conversation Summary: {summary}"),
    HumanMessagePromptTemplate.fromTemplate("{question}"),
  ]);
  const chain = prompt.pipe(llm);

  const vectorStore = await getPineconeVectorStore({
    embeddings: new OpenAIEmbeddings({ model: "text-embedding-3-large" }),
    indexName: process.env.PINECONE_INDEX!,
  });

  const retriever = vectorStore.asRetriever({ k: 5 });
  const context = await retriever.invoke(question);

  // const message = await chain.invoke({ context, summary, question });
  const message = await chain.invoke({ context, question });

  return new Response(
    new ReadableStream({
      async start(controller) {
        try {
          const audio = await generateSpeechStreamFromText({
            text: message.content as string,
          });

          for await (const chunk of audio) controller.enqueue(chunk);
        } catch (error) {
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    }),
    {
      headers: new Headers({
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      }),
    }
  );
}
