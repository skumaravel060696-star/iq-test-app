'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useHotkeys } from 'react-hotkeys-hook';

import type { AnswerRecord, GeneratedQuestion, Question, TestAttempt, UserProfile } from '@/lib/types';
import { usePageVisibility } from '@/hooks/use-page-visibility';
import { calculateAbilityScore, normalizeIqScore } from '@/lib/engine/scoring';
import { calculateValidity } from '@/lib/engine/validity';
import { addTestAttempt, getTestHistory, getUserProfile } from '@/lib/store';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Logo } from '@/components/Logo';
import {generateDynamicTest} from '@/ai/flows/generate-dynamic-test';

const NUMBER_OF_QUESTIONS = 20;

const DOMAIN_MIX = {
  logical: 0.3,
  pattern: 0.25,
  spatial: 0.20,
  numerical: 0.15,
  memory: 0.10,
};

const shuffle = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// --- Components ---

function QuestionTimer({ timeLimit, onTimeout, isPaused }: { timeLimit: number, onTimeout: () => void, isPaused: boolean }) {
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  useEffect(() => {
    setTimeLeft(timeLimit);
  }, [timeLimit]);

  useEffect(() => {
    if (isPaused) return;
    if (timeLeft <= 0) {
      onTimeout();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 0.1);
    }, 100);
    return () => clearInterval(timer);
  }, [timeLeft, onTimeout, isPaused]);

  const progress = (timeLeft / timeLimit) * 100;
  return <Progress value={progress} className="w-full h-2" />;
}

function QuestionCard({
  question,
  onAnswer,
  questionNumber,
  totalQuestions,
}: {
  question: GeneratedQuestion;
  onAnswer: (answer: string) => void;
  questionNumber: number;
  totalQuestions: number;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    if (selected) return;
    setSelected(option);
    setTimeout(() => onAnswer(option), 300);
  };
  
  useHotkeys('1,2,3,4', (_, handler) => {
    const index = parseInt(handler.keys?.join('') ?? '0') - 1;
    if (index >= 0 && index < question.shuffledOptions.length) {
        handleSelect(question.shuffledOptions[index]);
    }
  }, { enableOnFormTags: false, preventDefault: true });


  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardDescription>Question {questionNumber} of {totalQuestions} - {question.domain}</CardDescription>
        <CardTitle className="text-xl md:text-2xl font-normal leading-tight">{question.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {question.shuffledOptions.map((option, index) => (
            <Button
              key={option}
              onClick={() => handleSelect(option)}
              disabled={!!selected}
              variant={selected === option ? "default" : "outline"}
              className="h-auto min-h-12 py-3 justify-start text-left whitespace-normal text-base"
            >
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold border rounded-md h-6 w-6 flex items-center justify-center">{index+1}</span>
                <span>{option}</span>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// --- Main Client Component ---

export function QuizClient({ questionBank }: { questionBank: Question[] }) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [test, setTest] = useState<GeneratedQuestion[] | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [testStartTime, setTestStartTime] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [isFinishing, setIsFinishing] = useState(false);
  const { visibilityChanges, isVisible } = usePageVisibility();

  useEffect(() => {
    const profile = getUserProfile();
    if (!profile) {
      router.replace('/onboarding');
      return;
    }
    setUser(profile);
  }, [router]);

  useEffect(() => {
    if (user && !test) {
      const getTest = async () => {
        try {
          const isRetake = getTestHistory().length > 0;
          let currentDomainMix = { ...DOMAIN_MIX };

          if (isRetake) {
              const domains = shuffle(Object.keys(currentDomainMix));
              const percentages = shuffle(Object.values(currentDomainMix));
              currentDomainMix = domains.reduce((acc, domain, index) => {
                acc[domain as keyof typeof DOMAIN_MIX] = percentages[index];
                return acc;
              }, {} as typeof DOMAIN_MIX);
          }


          const { questions } = await generateDynamicTest({
            ageBand: user.age.toString(), // Simplified for example
            domainMix: currentDomainMix,
            questionBank: questionBank,
            numberOfQuestions: NUMBER_OF_QUESTIONS
          });
          setTest(questions);
          setTestStartTime(Date.now());
          setQuestionStartTime(Date.now());
        } catch (error) {
          console.error("Failed to generate test:", error);
          router.replace('/dashboard');
        }
      }
      getTest();
    }
  }, [user, test, questionBank, router]);
  
  const finishTest = useCallback(async (finalAnswers: AnswerRecord[]) => {
    if (!user || !test || isFinishing) return;
    setIsFinishing(true);

    const validityReport = calculateValidity({ answers: finalAnswers, visibilityChanges });
    const abilityScore = calculateAbilityScore(test, finalAnswers);
    const iqScore = normalizeIqScore(abilityScore, user.age, test.length);
    
    const newAttempt: TestAttempt = {
      id: uuidv4(),
      userId: user.id,
      questions: test,
      answers: finalAnswers,
      validityReport,
      abilityScore,
      iqScore,
      startedAt: new Date(testStartTime).toISOString(),
      completedAt: new Date().toISOString(),
      isPractice: getTestHistory().length > 0
    };

    addTestAttempt(newAttempt);
    router.replace(`/results/${newAttempt.id}`);

  }, [user, test, testStartTime, visibilityChanges, router, isFinishing]);

  const handleAnswer = useCallback((answer: string | null) => {
    if (!test) return;

    const timeTaken = (Date.now() - questionStartTime) / 1000;
    const currentQuestion = test[currentQuestionIndex];
    
    const newAnswer: AnswerRecord = {
      qid: currentQuestion.qid,
      answer,
      correct: answer === currentQuestion.answer,
      timeTaken,
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < test.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setQuestionStartTime(Date.now());
    } else {
      finishTest(updatedAnswers);
    }
  }, [test, questionStartTime, currentQuestionIndex, answers, finishTest]);

  const currentQuestion = useMemo(() => test?.[currentQuestionIndex], [test, currentQuestionIndex]);

  if (!user || !test || !currentQuestion) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
        <Logo />
        <p className="text-muted-foreground">Generating your personalized test...</p>
        <Progress value={test ? (currentQuestionIndex / test.length) * 100 : 5} className="w-1/4" />
      </div>
    );
  }
  
  if (isFinishing) {
     return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
        <Logo />
        <p className="text-muted-foreground">Calculating your results...</p>
        <Progress value={100} className="w-1/4" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 bg-background">
      <div className="w-full max-w-2xl">
         <div className="flex justify-between items-center mb-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon"><ArrowLeft/></Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to exit?</AlertDialogTitle>
                  <AlertDialogDescription>
                    If you leave now, your progress will be lost and the test will be invalidated.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Continue</AlertDialogCancel>
                  <AlertDialogAction onClick={() => router.replace('/dashboard')}>Exit Test</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Logo className="hidden sm:flex"/>
            <div className="w-8"></div>
         </div>
        
        <QuestionTimer
          key={currentQuestion.qid}
          timeLimit={currentQuestion.time_limit_sec}
          onTimeout={() => handleAnswer(null)}
          isPaused={!isVisible || isFinishing}
        />
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.qid}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full flex-1 flex items-center"
        >
          <QuestionCard
            question={currentQuestion}
            onAnswer={handleAnswer}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={test.length}
          />
        </motion.div>
      </AnimatePresence>

      <footer className="w-full max-w-2xl mt-4">
        <p className="text-center text-xs text-muted-foreground">Use keys 1-4 to answer quickly.</p>
      </footer>
    </main>
  );
}
