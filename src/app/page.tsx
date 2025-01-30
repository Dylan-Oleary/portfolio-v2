import { AudioResponder } from '~/components/AudioResponder';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col flex-grow items-center justify-center w-full">
        <AudioResponder />
      </main>
    </div>
  );
}
