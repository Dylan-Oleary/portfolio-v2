import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from "@langchain/core/prompts";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { NextRequest, NextResponse } from "next/server";
import { getPineconeVectorStore } from "~/app/lib/langchain";

// import testChatHistory from "./_test-chat-history.json";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const llm = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0.25 });

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
       Assume you are being interviewed for a job and answer the questions courteously and professionally. 
       Your knowledge is limited only to the context provided. 
       Do not become creative or make up anything.`
    ),
    SystemMessagePromptTemplate.fromTemplate("Context: {context}"),
    // SystemMessagePromptTemplate.fromTemplate("Conversation Summary: {summary}"),
    HumanMessagePromptTemplate.fromTemplate("{question}"),
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

  //   const message = await chain.invoke({ context, summary, question });
  const message = await chain.invoke({ context, question });

  return NextResponse.json({ message: message.content });
}
