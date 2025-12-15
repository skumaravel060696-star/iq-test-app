'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a dynamic test tailored to a user's age and difficulty preferences.
 *
 * - generateDynamicTest - Generates a dynamic test based on user age and difficulty mix.
 * - GenerateDynamicTestInput - The input type for the generateDynamicTest function.
 * - GeneratedDynamicTestOutput - The return type for the generateDynamicTest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the structure for a question
const QuestionSchema = z.object({
  qid: z.string().describe('Unique question identifier'),
  domain: z.string().describe('Domain of the question (e.g., logical, pattern)'),
  difficulty: z.number().describe('Difficulty level of the question (0-1)'),
  discrimination: z.number().describe('Discrimination index of the question'),
  guess_factor: z.number().describe('Guess factor of the question'),
  question: z.string().describe('The question text'),
  options: z.array(z.string()).describe('Array of possible answer options'),
  answer: z.string().describe('The correct answer'),
  time_limit_sec: z.number().describe('Time limit in seconds for the question'),
});

// Define the input schema for the dynamic test generation
const GenerateDynamicTestInputSchema = z.object({
  ageBand: z.string().describe('The age band of the user (e.g., 18-25)'),
  difficultyMix: z
    .object({
      easy: z.number().describe('Percentage of easy questions (0-1)'),
      medium: z.number().describe('Percentage of medium questions (0-1)'),
      hard: z.number().describe('Percentage of hard questions (0-1)'),
    })
    .describe('The desired difficulty mix for the test'),
  questionBank: z.array(QuestionSchema).describe('The question bank to select questions from'),
  numberOfQuestions: z.number().describe('The total number of questions to generate'),
});

export type GenerateDynamicTestInput = z.infer<typeof GenerateDynamicTestInputSchema>;

// Define the output schema for the dynamic test generation
const GeneratedQuestionSchema = QuestionSchema.extend({
  shuffledOptions: z.array(z.string()).describe('The options for this question, shuffled'),
});

const GeneratedDynamicTestOutputSchema = z.object({
  questions: z.array(GeneratedQuestionSchema).describe('The generated list of questions for the test'),
});

export type GeneratedDynamicTestOutput = z.infer<typeof GeneratedDynamicTestOutputSchema>;


// Exported function to generate the dynamic test
export async function generateDynamicTest(input: GenerateDynamicTestInput): Promise<GeneratedDynamicTestOutput> {
  return generateDynamicTestFlow(input);
}

// Define the Genkit flow
const generateDynamicTestFlow = ai.defineFlow(
  {
    name: 'generateDynamicTestFlow',
    inputSchema: GenerateDynamicTestInputSchema,
    outputSchema: GeneratedDynamicTestOutputSchema,
  },
  async input => {
    // Destructure input parameters
    const {ageBand, difficultyMix, questionBank, numberOfQuestions} = input;

    // Filter questions based on the difficulty mix
    const easyQuestions = questionBank.filter(q => q.difficulty <= 0.3);
    const mediumQuestions = questionBank.filter(q => q.difficulty > 0.3 && q.difficulty <= 0.7);
    const hardQuestions = questionBank.filter(q => q.difficulty > 0.7);

    // Calculate the number of questions for each difficulty level
    const numEasy = Math.round(numberOfQuestions * difficultyMix.easy);
    const numMedium = Math.round(numberOfQuestions * difficultyMix.medium);
    const numHard = Math.round(numberOfQuestions * difficultyMix.hard);

    // Function to select a random subset of questions
    function selectRandomQuestions<T>(questions: T[], count: number): T[] {
      const shuffled = [...questions].sort(() => 0.5 - Math.random()); // Shuffle the questions
      return shuffled.slice(0, count); // Take the first 'count' questions
    }

    // Select questions for each difficulty level
    const selectedEasyQuestions = selectRandomQuestions(easyQuestions, numEasy);
    const selectedMediumQuestions = selectRandomQuestions(mediumQuestions, numMedium);
    const selectedHardQuestions = selectRandomQuestions(hardQuestions, numHard);

    // Combine selected questions
    const selectedQuestions = [...selectedEasyQuestions, ...selectedMediumQuestions, ...selectedHardQuestions];

    // Shuffle the selected questions to randomize the order
    const shuffledQuestions = [...selectedQuestions].sort(() => 0.5 - Math.random());

    const generatedQuestions = shuffledQuestions.map(question => {
      const shuffledOptions = [...question.options].sort(() => 0.5 - Math.random());
      return {...question, shuffledOptions};
    });

    // Return the generated test
    return {
      questions: generatedQuestions,
    };
  }
);
