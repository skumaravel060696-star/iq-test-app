import type { AnswerRecord, ValidityReport } from "@/lib/types";

const EXTREMELY_FAST_THRESHOLD_SEC = 2; // Less than 2 seconds is suspicious
const REPEATED_ANSWER_STREAK = 4; // 4 identical answers in a row is a flag

interface ValidityInput {
  answers: AnswerRecord[];
  visibilityChanges: number;
}

export function calculateValidity({ answers, visibilityChanges }: ValidityInput): ValidityReport {
  const warnings: string[] = [];
  let confidence = 1.0;
  const totalQuestions = answers.length;

  if (totalQuestions === 0) {
    return { confidence: 0, status: 'Low', warnings: ['No questions answered.'] };
  }

  // 1. Check for app backgrounding
  if (visibilityChanges > 0) {
    warnings.push(`The app was backgrounded ${visibilityChanges} time(s).`);
    confidence -= visibilityChanges * 0.15; // 15% penalty per change
  }

  // 2. Check for extremely fast responses
  const fastResponses = answers.filter(a => a.timeTaken < EXTREMELY_FAST_THRESHOLD_SEC).length;
  if (fastResponses > totalQuestions / 4) { // If more than 25% of answers are too fast
    warnings.push(`${fastResponses} questions were answered suspiciously fast.`);
    confidence -= 0.2;
  }

  // 3. Check for repeated answer patterns
  let maxStreak = 0;
  let currentStreak = 1;
  for (let i = 1; i < answers.length; i++) {
    if (answers[i].answer && answers[i].answer === answers[i-1].answer) {
      currentStreak++;
    } else {
      maxStreak = Math.max(maxStreak, currentStreak);
      currentStreak = 1;
    }
  }
  maxStreak = Math.max(maxStreak, currentStreak);
  
  if (maxStreak >= REPEATED_ANSWER_STREAK) {
    warnings.push(`A pattern of ${maxStreak} identical consecutive answers was detected.`);
    confidence -= 0.15;
  }

  // 4. Check for perfect score with very low average time
  const correctAnswers = answers.filter(a => a.correct).length;
  if (correctAnswers === totalQuestions) {
    const totalTime = answers.reduce((sum, a) => sum + a.timeTaken, 0);
    const averageTime = totalTime / totalQuestions;
    if (averageTime < 5) { // Perfect score with avg time under 5s is suspicious
      warnings.push('Perfect accuracy achieved with an unusually low average response time.');
      confidence -= 0.25;
    }
  }

  // Final confidence clamping
  confidence = Math.max(0, Math.min(1, confidence));

  let status: 'High' | 'Medium' | 'Low' = 'High';
  if (confidence < 0.8) {
    status = 'Medium';
  }
  if (confidence < 0.5) {
    status = 'Low';
  }

  return {
    confidence,
    status,
    warnings,
  };
}
