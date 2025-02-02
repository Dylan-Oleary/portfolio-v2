'use client';

import { type FormEvent, useState } from 'react';

export type ChatFormProps = {
  className?: string;
  disabled?: boolean;
  onSubmit(data: { question: string }): void;
};

export function ChatForm({ className = '', disabled = false, onSubmit }: ChatFormProps) {
  const [question, setQuestion] = useState<string>('');

  const onFormSubmit = async (event: FormEvent) => {
    event?.preventDefault();
    event?.stopPropagation();

    setQuestion('');
    onSubmit({ question });
  };

  return (
    <form
      className={`flex gap-8 max-w-[450px] w-full pb-4 text-xl bg-transparent ${className}`}
      onSubmit={onFormSubmit}
    >
      <label className="text-nowrap font-bold" htmlFor="question">
        ask &#62;
      </label>
      <input
        autoFocus
        className="bg-inherit flex-grow"
        disabled={disabled}
        id="question"
        name="question"
        onChange={({ target: { value } }) => setQuestion(value)}
        type="text"
        value={question}
      />
    </form>
  );
}
