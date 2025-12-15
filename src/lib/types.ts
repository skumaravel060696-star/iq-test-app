export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  consent: boolean;
  createdAt: string;
}

export interface Question {
  qid: string;
  domain: 'logical' | 'pattern' | 'spatial' | 'numerical' | 'memory';
  difficulty: number; // 0-1
  discrimination: number; // 0-1
  guess_factor: number; // 0-1
  question: string;
  options: string[];
  answer: string;
  time_limit_sec: number;
}

export interface GeneratedQuestion extends Question {
  shuffledOptions: string[];
}

export interface AgeNorm {
  age_band: string;
  mean: number;
  std_dev: number;
}

export type ValidityStatus = 'High' | 'Medium' | 'Low';

export interface ValidityReport {
  confidence: number; // 0-1
  status: ValidityStatus;
  warnings: string[];
}

export interface AnswerRecord {
  qid: string;
  answer: string | null;
  correct: boolean;
  timeTaken: number; // in seconds
}

export interface TestAttempt {
  id: string;
  userId: string;
  questions: Question[];
  answers: AnswerRecord[];
  validityReport: ValidityReport;
  abilityScore: number;
  iqScore: number;
  startedAt: string;
  completedAt: string;
}
