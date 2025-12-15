import { questionBank } from '@/lib/data/question-bank';
import { QuizClient } from './QuizClient';

export default async function TestPage() {
  // In a real app, you might fetch this from a dynamic source.
  // Here, we're just passing the static bank.
  const questions = questionBank;

  return <QuizClient questionBank={questions} />;
}
