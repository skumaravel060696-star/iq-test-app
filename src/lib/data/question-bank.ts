
import type { Question } from '@/lib/types';

export const questionBank: Question[] = [
  // Logical
  {
    "qid": "LOG_E_001",
    "domain": "logical",
    "difficulty": 0.2,
    "discrimination": 0.6,
    "guess_factor": 0.25,
    "question": "Which number should come next in the series? 1, 2, 4, 8, ...",
    "options": ["12", "14", "16", "18"],
    "answer": "16",
    "time_limit_sec": 30
  },
  {
    "qid": "LOG_M_002",
    "domain": "logical",
    "difficulty": 0.5,
    "discrimination": 0.7,
    "guess_factor": 0.25,
    "question": "SCD, TEF, UGH, ___, WKL",
    "options": ["CMN", "UJI", "VIJ", "IJT"],
    "answer": "VIJ",
    "time_limit_sec": 45
  },
  {
    "qid": "LOG_H_003",
    "domain": "logical",
    "difficulty": 0.8,
    "discrimination": 0.85,
    "guess_factor": 0.25,
    "question": "If FRIEND is coded as HUMJTK, how is CANDLE written in that code?",
    "options": ["EDRIRL", "DCQHQK", "ESJFME", "FYOBPC"],
    "answer": "EDRIRL",
    "time_limit_sec": 60
  },
  {
    "qid": "LOG_M_004",
    "domain": "logical",
    "difficulty": 0.6,
    "discrimination": 0.72,
    "guess_factor": 0.25,
    "question": "All roses are flowers. Some flowers fade quickly. Therefore...",
    "options": ["All roses fade quickly", "Some roses fade quickly", "No roses fade quickly", "We cannot be certain if any roses fade quickly"],
    "answer": "We cannot be certain if any roses fade quickly",
    "time_limit_sec": 50
  },
   {
    "qid": "LOG_E_005",
    "domain": "logical",
    "difficulty": 0.3,
    "discrimination": 0.65,
    "guess_factor": 0.25,
    "question": "A is B's sister. C is B's mother. D is C's father. E is D's mother. Then, how is A related to D?",
    "options": ["Grandfather", "Grandmother", "Daughter", "Granddaughter"],
    "answer": "Granddaughter",
    "time_limit_sec": 40
  },
  {
    "qid": "LOG_H_006",
    "domain": "logical",
    "difficulty": 0.8,
    "discrimination": 0.8,
    "guess_factor": 0.25,
    "question": "Statement: All artists are whimsical. Some whimsical people are rich. Conclusion: Some artists are rich.",
    "options": ["True", "False", "Cannot be determined", "Both are unrelated"],
    "answer": "Cannot be determined",
    "time_limit_sec": 55
  },

  // Pattern Recognition
  {
    "qid": "PAT_E_001",
    "domain": "pattern",
    "difficulty": 0.25,
    "discrimination": 0.65,
    "guess_factor": 0.25,
    "question": "Look at this series: 7, 10, 8, 11, 9, 12, ... What number should come next?",
    "options": ["7", "10", "12", "13"],
    "answer": "10",
    "time_limit_sec": 30
  },
  {
    "qid": "PAT_M_002",
    "domain": "pattern",
    "difficulty": 0.6,
    "discrimination": 0.75,
    "guess_factor": 0.25,
    "question": "Which shape is the odd one out?",
    "options": ["Square", "Triangle", "Circle", "Rectangle"],
    "answer": "Circle",
    "time_limit_sec": 40
  },
  {
    "qid": "PAT_H_003",
    "domain": "pattern",
    "difficulty": 0.9,
    "discrimination": 0.9,
    "guess_factor": 0.25,
    "question": "3, 5, 11, 21, 43, ?",
    "options": ["85", "86", "87", "88"],
    "answer": "85",
    "time_limit_sec": 75
  },
   {
    "qid": "PAT_M_004",
    "domain": "pattern",
    "difficulty": 0.5,
    "discrimination": 0.68,
    "guess_factor": 0.25,
    "question": "Which of the following does not belong: Violin, Flute, Cello, Guitar",
    "options": ["Violin", "Flute", "Cello", "Guitar"],
    "answer": "Flute",
    "time_limit_sec": 35
  },
   {
    "qid": "PAT_E_005",
    "domain": "pattern",
    "difficulty": 0.4,
    "discrimination": 0.6,
    "guess_factor": 0.25,
    "question": "Look at this series: F2, __, D8, C16, B32, ...",
    "options": ["A16", "G4", "E4", "E3"],
    "answer": "E4",
    "time_limit_sec": 40
  },
  {
    "qid": "PAT_H_006",
    "domain": "pattern",
    "difficulty": 0.85,
    "discrimination": 0.82,
    "guess_factor": 0.25,
    "question": "What is the next number in the sequence: 1, 1, 2, 3, 5, 8, ...?",
    "options": ["11", "13", "15", "21"],
    "answer": "13",
    "time_limit_sec": 30
  },

  // Spatial Reasoning
  {
    "qid": "SPA_E_001",
    "domain": "spatial",
    "difficulty": 0.3,
    "discrimination": 0.68,
    "guess_factor": 0.25,
    "question": "If you rotate a 'd' 180 degrees, what letter do you get?",
    "options": ["p", "b", "q", "d"],
    "answer": "p",
    "time_limit_sec": 30
  },
  {
    "qid": "SPA_M_002",
    "domain": "spatial",
    "difficulty": 0.55,
    "discrimination": 0.72,
    "guess_factor": 0.25,
    "question": "Which 3D shape can be made from a 2D net of 6 identical squares?",
    "options": ["Pyramid", "Cube", "Sphere", "Cylinder"],
    "answer": "Cube",
    "time_limit_sec": 45
  },
  {
    "qid": "SPA_H_003",
    "domain": "spatial",
    "difficulty": 0.85,
    "discrimination": 0.88,
    "guess_factor": 0.25,
    "question": "A cube is painted red on all sides. It is then cut into 27 smaller cubes. How many small cubes have exactly one side painted?",
    "options": ["4", "6", "8", "12"],
    "answer": "6",
    "time_limit_sec": 90
  },
  {
    "qid": "SPA_H_004",
    "domain": "spatial",
    "difficulty": 0.8,
    "discrimination": 0.85,
    "guess_factor": 0.25,
    "question": "A man walks 5km East, then 5km North, then 5km West. How far is he from his starting point?",
    "options": ["0km", "5km", "10km", "15km"],
    "answer": "5km",
    "time_limit_sec": 45
  },
   {
    "qid": "SPA_M_005",
    "domain": "spatial",
    "difficulty": 0.6,
    "discrimination": 0.7,
    "guess_factor": 0.25,
    "question": "Which of the following is a mirror image of the word 'REFLECTION'?",
    "options": ["NOITCELFER", "ЯƎᖷ⅃ƎƆ⊥ION", "REFLEC┴ION", "ИOITƆƎLᖷƎЯ"],
    "answer": "ИOITƆƎLᖷƎЯ",
    "time_limit_sec": 50
  },
  {
    "qid": "SPA_E_006",
    "domain": "spatial",
    "difficulty": 0.4,
    "discrimination": 0.65,
    "guess_factor": 0.25,
    "question": "You are facing North and turn right, then turn right again, then turn left. Which direction are you facing now?",
    "options": ["North", "South", "East", "West"],
    "answer": "West",
    "time_limit_sec": 35
  },

  // Numerical Reasoning
  {
    "qid": "NUM_E_001",
    "domain": "numerical",
    "difficulty": 0.15,
    "discrimination": 0.55,
    "guess_factor": 0.25,
    "question": "What is 15% of 200?",
    "options": ["15", "20", "30", "40"],
    "answer": "30",
    "time_limit_sec": 30
  },
  {
    "qid": "NUM_M_002",
    "domain": "numerical",
    "difficulty": 0.45,
    "discrimination": 0.7,
    "guess_factor": 0.25,
    "question": "A car travels at 60 mph. How long does it take to travel 150 miles?",
    "options": ["2 hours", "2.5 hours", "3 hours", "3.5 hours"],
    "answer": "2.5 hours",
    "time_limit_sec": 50
  },
  {
    "qid": "NUM_H_003",
    "domain": "numerical",
    "difficulty": 0.75,
    "discrimination": 0.8,
    "guess_factor": 0.25,
    "question": "If 5 machines can make 5 widgets in 5 minutes, how long would it take 100 machines to make 100 widgets?",
    "options": ["1 minute", "5 minutes", "100 minutes", "20 minutes"],
    "answer": "5 minutes",
    "time_limit_sec": 70
  },
   {
    "qid": "NUM_M_004",
    "domain": "numerical",
    "difficulty": 0.55,
    "discrimination": 0.71,
    "guess_factor": 0.25,
    "question": "A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?",
    "options": ["$0.10", "$0.05", "$1.00", "$0.50"],
    "answer": "$0.05",
    "time_limit_sec": 60
  },
  {
    "qid": "NUM_E_005",
    "domain": "numerical",
    "difficulty": 0.3,
    "discrimination": 0.6,
    "guess_factor": 0.25,
    "question": "A farmer has 17 sheep and all but 9 die. How many are left?",
    "options": ["9", "8", "17", "26"],
    "answer": "9",
    "time_limit_sec": 30
  },
  {
    "qid": "NUM_H_006",
    "domain": "numerical",
    "difficulty": 0.9,
    "discrimination": 0.88,
    "guess_factor": 0.25,
    "question": "A lily pad in a pond doubles in size every day. If it takes 48 days for the lily pad to cover the entire pond, how long would it take for the lily pad to cover half the pond?",
    "options": ["24 days", "47 days", "36 days", "46 days"],
    "answer": "47 days",
    "time_limit_sec": 60
  },

  // Working Memory
  {
    "qid": "MEM_E_001",
    "domain": "memory",
    "difficulty": 0.3,
    "discrimination": 0.6,
    "guess_factor": 0.25,
    "question": "Remember this sequence: A-1-B-2. What was the second item?",
    "options": ["A", "1", "B", "2"],
    "answer": "1",
    "time_limit_sec": 20
  },
  {
    "qid": "MEM_M_002",
    "domain": "memory",
    "difficulty": 0.6,
    "discrimination": 0.78,
    "guess_factor": 0.25,
    "question": "Memorize: Red, Blue, Green, Yellow. Which color was third in the sequence?",
    "options": ["Red", "Blue", "Green", "Yellow"],
    "answer": "Green",
    "time_limit_sec": 25
  },
  {
    "qid": "MEM_H_003",
    "domain": "memory",
    "difficulty": 0.9,
    "discrimination": 0.9,
    "guess_factor": 0.25,
    "question": "Study the list: Apple, Chair, 7, Dog, Blue. What was the item after the number?",
    "options": ["Chair", "Dog", "Blue", "Apple"],
    "answer": "Dog",
    "time_limit_sec": 35
  },
  {
    "qid": "MEM_H_004",
    "domain": "memory",
    "difficulty": 0.85,
    "discrimination": 0.88,
    "guess_factor": 0.25,
    "question": "Reverse the digits of this number: 85293. Which digit is now in the hundreds place?",
    "options": ["8", "5", "2", "9"],
    "answer": "2",
    "time_limit_sec": 30
  },
  {
    "qid": "MEM_M_005",
    "domain": "memory",
    "difficulty": 0.7,
    "discrimination": 0.75,
    "guess_factor": 0.25,
    "question": "Memorize the following address: 1234 Oak St. Anytown, USA. What was the street name?",
    "options": ["Oak St.", "Anytown", "1234", "USA"],
    "answer": "Oak St.",
    "time_limit_sec": 25
  },
  {
    "qid": "MEM_E_006",
    "domain": "memory",
    "difficulty": 0.4,
    "discrimination": 0.62,
    "guess_factor": 0.25,
    "question": "Listen to the sequence: 5, 9, 3. Repeat it backwards.",
    "options": ["3, 9, 5", "5, 9, 3", "9, 3, 5", "3, 5, 9"],
    "answer": "3, 9, 5",
    "time_limit_sec": 20
  }
];
