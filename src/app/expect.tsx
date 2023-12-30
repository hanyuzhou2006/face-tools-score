"use client"

import { ChangeEvent, ChangeEventHandler, FormEvent, useState } from "react";

interface ExpectProps {
  submitFaceScore: (score: number) => void;
}

export default function Expect({ submitFaceScore }: ExpectProps) {

  const [score, setScore] = useState('');
  const [message, setMessage] = useState('');
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (score === '') {
      setMessage('请输入期望分数');
      return;
    }

    const expect = Number(score);
    if (expect < 50) {
      setMessage('打这么低的分数过分啦');
    }

    submitFaceScore(expect);
  };

  const onChangeScore = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage('');
    setScore(e.target.value);
  }
  return (
    <>
      <div className="flex flex-row">
        <label>
          <input
            className="border border-gray-300 p-2 mt-1"
            placeholder="Expect"
            type="number"
            min={50}
            max={100}
            value={score}
            onChange={onChangeScore}
          />
        </label>
        <button type="button" className="border border-green-300 p-2 mt-1"
          onClick={submit}
        >期望</button>
      </div>
      <div className="text-justify">{message}</div>
    </>
  )
}