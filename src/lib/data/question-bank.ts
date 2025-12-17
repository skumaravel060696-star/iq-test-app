import type { Question } from '@/lib/types';

// This file is now intended for basic practice questions.

export const practiceQuestionBank: Question[] = [
  {
    "qid": "PRAC_LOG_001",
    "domain": "logical",
    "difficulty": 0.1,
    "discrimination": 0.5,
    "guess_factor": 0.25,
    "question": "Which number logically follows this series? 2, 4, 6, 8, ...",
    "options": ["9", "10", "11", "12"],
    "answer": "10",
    "time_limit_sec": 20
  },
  {
    "qid": "PRAC_PAT_001",
    "domain": "pattern",
    "difficulty": 0.1,
    "discrimination": 0.5,
    "guess_factor": 0.25,
    "question": "What comes next in the pattern: A, B, C, A, B, ...",
    "options": ["A", "B", "C", "D"],
    "answer": "C",
    "time_limit_sec": 20
  },
  {
    "qid": "PRAC_SPA_001",
    "domain": "spatial",
    "difficulty": 0.1,
    "discrimination": 0.5,
    "guess_factor": 0.25,
    "question": "If you mirror the letter 'L' horizontally, what does it look like?",
    "options": ["L", "J", "7", "T"],
    "answer": "J",
    "time_limit_sec": 20
  },
  {
    "qid": "PRAC_NUM_001",
    "domain": "numerical",
    "difficulty": 0.1,
    "discrimination": 0.5,
    "guess_factor": 0.25,
    "question": "What is 5 + 7?",
    "options": ["10", "11", "12", "13"],
    "answer": "12",
    "time_limit_sec": 20
  },
  {
    "qid": "PRAC_MEM_001",
    "domain": "memory",
    "difficulty": 0.1,
    "discrimination": 0.5,
    "guess_factor": 0.25,
    "question": "Remember this word: 'TREE'. What was the word?",
    "options": ["CAR", "HOUSE", "TREE", "RIVER"],
    "answer": "TREE",
    "time_limit_sec": 15
  },
  {
    "qid": "PRAC_LOG_002",
    "domain": "logical",
    "difficulty": 0.1,
    "discrimination": 0.5,
    "guess_factor": 0.25,
    "question": "If all cats are animals, and Felix is a cat, then Felix is an ____.",
    "options": ["animal", "dog", "bird", "fish"],
    "answer": "animal",
    "time_limit_sec": 20
  },
  {
    "qid": "PRAC_PAT_002",
    "domain": "pattern",
    "difficulty": 0.1,
    "discrimination": 0.5,
    "guess_factor": 0.25,
    "question": "Which shape is the odd one out?",
    "options": ["Circle", "Square", "Triangle", "Star"],
    "answer": "Circle",
    "time_limit_sec": 20
  },
  {
    "qid": "PRAC_SPA_002",
    "domain": "spatial",
    "difficulty": 0.1,
    "discrimination": 0.5,
    "guess_factor": 0.25,
    "question": "How many sides does a square have?",
    "options": ["3", "4", "5", "6"],
    "answer": "4",
    "time_limit_sec": 20
  },
  {
    "qid": "PRAC_NUM_002",
    "domain": "numerical",
    "difficulty": 0.1,
    "discrimination": 0.5,
    "guess_factor": 0.25,
    "question": "What is 10 - 3?",
    "options": ["5", "6", "7", "8"],
    "answer": "7",
    "time_limit_sec": 20
  },
  {
    "qid": "PRAC_MEM_002",
    "domain": "memory",
    "difficulty": 0.1,
    "discrimination": 0.5,
    "guess_factor": 0.25,
    "question": "Remember this number: 5. What was the number?",
    "options": ["3", "4", "5", "6"],
    "answer": "5",
    "time_limit_sec": 15
  }
];
