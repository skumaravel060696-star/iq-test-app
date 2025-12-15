import type { AgeNorm } from "@/lib/types";

export const ageNorms: AgeNorm[] = [
  { "age_band": "0-17", "mean": 100, "std_dev": 15 },
  { "age_band": "18-25", "mean": 105, "std_dev": 15 },
  { "age_band": "26-35", "mean": 102, "std_dev": 15 },
  { "age_band": "36-45", "mean": 100, "std_dev": 15 },
  { "age_band": "46-55", "mean": 98, "std_dev": 15 },
  { "age_band": "56-65", "mean": 95, "std_dev": 15 },
  { "age_band": "66-120", "mean": 92, "std_dev": 15 }
];

export const getAgeNorm = (age: number): AgeNorm => {
  if (age <= 17) return ageNorms[0];
  if (age >= 18 && age <= 25) return ageNorms[1];
  if (age >= 26 && age <= 35) return ageNorms[2];
  if (age >= 36 && age <= 45) return ageNorms[3];
  if (age >= 46 && age <= 55) return ageNorms[4];
  if (age >= 56 && age <= 65) return ageNorms[5];
  return ageNorms[6];
};
