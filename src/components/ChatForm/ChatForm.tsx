'use client';

import { type FormEvent, useState } from 'react';

export type ChatFormProps = { className?: string; onSubmit(data: { question: string }): void };

export function ChatForm({ className = '', onSubmit }: ChatFormProps) {
  const [question, setQuestion] = useState<string>('');

  const onFormSubmit = async (event: FormEvent) => {
    event?.preventDefault();
    event?.stopPropagation();

    setQuestion('');
    onSubmit({ question });
  };

  return (
    <form className={`w-[450px] mt-8 ${className}`} onSubmit={onFormSubmit}>
      <input
        className="text-black p-4 w-full"
        name="question"
        onChange={({ target: { value } }) => setQuestion(value)}
        type="text"
        value={question}
      />
      <button className="bg-blue-400 p-4 mt-4 w-full" type="submit">
        Submit
      </button>
    </form>
  );
}
