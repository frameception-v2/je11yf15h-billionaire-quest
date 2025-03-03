export interface Question {
  level: number;
  prize: number;
  text: string;
  options: string[];
  correctIndex: number;
}

export const questions: Question[] = [
  {
    level: 1,
    prize: 100,
    text: "What is the capital of France?",
    options: ["London", "Paris", "Berlin", "Madrid"],
    correctIndex: 1
  },
  {
    level: 2,
    prize: 200,
    text: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctIndex: 1
  },
  {
    level: 3,
    prize: 400,
    text: "Who painted the Mona Lisa?",
    options: ["Van Gogh", "Picasso", "Da Vinci", "Rembrandt"],
    correctIndex: 2
  },
  // Add more questions following the pattern up to level 15
  // Prize doubles each level (100, 200, 400, 800, 1600...)
];
