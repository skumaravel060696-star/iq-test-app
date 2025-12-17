import { practiceQuestionBank } from '@/lib/data/question-bank';
import { logicalQuestionBank } from '@/lib/data/question-bank-logical';
import { patternQuestionBank } from '@/lib/data/question-bank-pattern';
import { spatialQuestionBank } from '@/lib/data/question-bank-spatial';
import { numericalQuestionBank } from '@/lib/data/question-bank-numerical';
import { memoryQuestionBank } from '@/lib/data/question-bank-memory';
import { QuizClient } from './QuizClient';
import type { Question } from '@/lib/types';

export type QuestionBanks = {
  logical: Question[];
  pattern: Question[];
  spatial: Question[];
  numerical: Question[];
  memory: Question[];
  practice: Question[];
};


export default async function TestPage() {

  const allQuestionBanks: QuestionBanks = {
    logical: logicalQuestionBank,
    pattern: patternQuestionBank,
    spatial: spatialQuestionBank,
    numerical: numericalQuestionBank,
    memory: memoryQuestionBank,
    practice: practiceQuestionBank,
  };

  return <QuizClient questionBanks={allQuestionBanks} />;
}
