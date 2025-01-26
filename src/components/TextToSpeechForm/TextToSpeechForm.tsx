'use client';

import { type FormEvent, useState } from 'react';

export type TextToSpeechFormProps = {
  onSubmit: (value: string) => void;
};

export function TextToSpeechForm(props: TextToSpeechFormProps) {
  const [question, setQuestion] = useState<string>('');

  const onFormSubmit = async (event: FormEvent) => {
    event?.preventDefault();
    event?.stopPropagation();

    setQuestion('');
    props.onSubmit(question);
  };

  return (
    <form className="w-[450px] mt-8" onSubmit={onFormSubmit}>
      <input
        className="text-black p-4 w-full"
        name="question"
        onChange={(event) => setQuestion(event.target.value)}
        type="text"
        value={question}
      />
      <button className="bg-blue-400 p-4 mt-4 w-full" type="submit">
        Submit
      </button>
    </form>
  );
}
