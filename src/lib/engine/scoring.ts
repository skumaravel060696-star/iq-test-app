import type { AnswerRecord, GeneratedQuestion, TestAttempt } from "@/lib/types";
import { getAgeNorm } from "@/lib/data/age-norms";

/**
 * Calculates a time factor for scoring.
 * Rewards faster correct answers.
 * @param timeTaken - Time taken for the question in seconds.
 * @param timeLimit - The time limit for the question in seconds.
 * @returns A score multiplier based on time.
 */
function calculateTimeFactor(timeTaken: number, timeLimit: number): number {
  if (timeTaken >= timeLimit) {
    return 0.8;
  }
  const timeRatio = timeTaken / timeLimit;
  // Linear decay from 1.2 to 0.8
  // At timeRatio 0 (instant answer), factor is 1.2
  // At timeRatio 1 (max time), factor is 0.8
  return 1.2 - (0.4 * timeRatio);
}

/**
 * Calculates the user's raw ability score (theta) based on their answers.
 * θ = Σ (correct * discrimination * time_factor)
 * @param questions - The list of questions in the test.
 * @param answers - The user's answers.
 * @returns The raw ability score.
 */
export function calculateAbilityScore(questions: GeneratedQuestion[], answers: AnswerRecord[]): number {
  let totalScore = 0;

  answers.forEach(answer => {
    if (answer.correct) {
      const question = questions.find(q => q.qid === answer.qid);
      if (question) {
        const timeFactor = calculateTimeFactor(answer.timeTaken, question.time_limit_sec);
        totalScore += question.discrimination * timeFactor;
      }
    }
  });

  return totalScore;
}

/**
 * Normalizes the raw ability score into a final IQ score.
 * IQ = 100 + 15 * (θ - μ_age) / σ_age
 * Clamps the IQ score between 70 and 145.
 * @param abilityScore - The user's raw ability score.
 * @param age - The user's age.
 * @param totalQuestions - The number of questions in the test to scale the norm mean.
 * @returns The normalized and clamped IQ score.
 */
export function normalizeIqScore(abilityScore: number, age: number, totalQuestions: number): number {
  const norm = getAgeNorm(age);
  
  // A simple scaling of the mean based on an assumed average performance.
  // This is a simplification; a real psychometric model would have a more robust way to map theta to IQ.
  // Let's assume an average discrimination of 0.7 and time factor of 1.0. 
  // An average user gets 50% right. So, scaled_mean = 0.5 * 0.7 * 1.0 * totalQuestions.
  // This is a placeholder for a more complex IRT-based mapping.
  const scaledMean = norm.mean / 100 * totalQuestions * 0.5;
  const scaledStdDev = norm.std_dev / 100 * totalQuestions * 0.2;


  if (scaledStdDev === 0) {
    return 100; // Avoid division by zero
  }
  
  const rawIq = 100 + 15 * ((abilityScore - scaledMean) / scaledStdDev);

  // Clamp the IQ score
  const clampedIq = Math.max(70, Math.min(145, rawIq));
  
  return Math.round(clampedIq);
}
