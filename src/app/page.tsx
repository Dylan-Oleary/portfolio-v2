import { TextToSpeechForm } from "../components";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col flex-grow items-center justify-center w-full">
        <h2>Portfolio V2 </h2>
        <TextToSpeechForm />
      </main>
    </div>
  );
}
