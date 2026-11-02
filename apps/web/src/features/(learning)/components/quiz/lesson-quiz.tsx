import { BookOpen, Check, CheckCircle2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@edunesia/ui/components/button";

export function Quiz({ programming }: { programming: boolean }) {
  const [answer, setAnswer] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const options = programming
    ? [
        "console.log displays a value in the console.",
        "console.log declares a variable.",
        "console.log repeats a statement forever.",
      ]
    : [
        "A model describes a relationship between quantities.",
        "A model is always a computer simulation.",
        "A model removes the need to state assumptions.",
      ];
  const explanation = programming
    ? "console.log sends a value to the runtime console, which is useful for checking output."
    : "A model gives a compact way to describe relationships. Its assumptions still matter.";
  return (
    <div className="mt-4">
      <fieldset>
        <legend className="sr-only">Choose the best answer</legend>
        <div className="grid gap-2">
          {options.map((option, index) => (
            <label
              key={option}
              className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-md border px-3 text-sm ${answer === index ? "border-[#155eef] bg-blue-50 dark:bg-blue-950/30" : "bg-background hover:bg-muted/50"}`}
            >
              <input
                type="radio"
                name="lesson-quiz"
                checked={answer === index}
                onChange={() => {
                  setAnswer(index);
                  setSubmitted(false);
                }}
                className="accent-[#155eef]"
              />
              {option}
            </label>
          ))}
        </div>
      </fieldset>
      {submitted && (
        <div role="status" className="mt-3 rounded-md border bg-background p-3 text-sm">
          <p
            className={
              answer === 0
                ? "font-semibold text-emerald-700 dark:text-emerald-400"
                : "font-semibold text-destructive"
            }
          >
            {answer === 0 ? "Correct" : "Incorrect"} · Score: {answer === 0 ? "1 / 1" : "0 / 1"}
          </p>
          <p className="mt-1 leading-6 text-muted-foreground">{explanation}</p>
        </div>
      )}
      <div className="mt-3 flex gap-2">
        <Button
          size="sm"
          disabled={answer === null || submitted}
          onClick={() => setSubmitted(true)}
        >
          {submitted ? "Answer submitted" : "Check answer"}
        </Button>
        {submitted && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setAnswer(null);
              setSubmitted(false);
            }}
          >
            Retry quiz
          </Button>
        )}
      </div>
    </div>
  );
}

export function ReflectionExercise({ lessonTitle }: { lessonTitle: string }) {
  const [response, setResponse] = useState("");
  const [completed, setCompleted] = useState(false);
  return (
    <form
      className="mt-6 rounded-lg border p-4 sm:p-5"
      onSubmit={(event) => {
        event.preventDefault();
        if (response.trim()) setCompleted(true);
      }}
    >
      <div className="flex items-center gap-2">
        <BookOpen className="size-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold">Practice the idea</h2>
      </div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Write one thing you would explain to a friend about “{lessonTitle}”. Your response stays in
        this page preview.
      </p>
      <label htmlFor="lesson-reflection" className="mt-4 block text-sm font-medium">
        Your reflection
      </label>
      <textarea
        id="lesson-reflection"
        value={response}
        onChange={(event) => {
          setResponse(event.target.value);
          setCompleted(false);
        }}
        rows={3}
        className="mt-2 w-full resize-y rounded-md border bg-background px-3 py-2 text-sm leading-6 outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        placeholder="Write a few words in your own terms..."
      />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Button type="submit" size="sm" disabled={!response.trim() || completed}>
          {completed ? <CheckCircle2 /> : <Check />}
          {completed ? "Exercise complete in preview" : "Mark exercise complete"}
        </Button>
        {completed && (
          <p role="status" className="text-sm text-muted-foreground">
            Response recorded for this page only.
          </p>
        )}
      </div>
    </form>
  );
}
