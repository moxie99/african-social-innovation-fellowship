interface Question {
  number: number
  question: string
  options: {
    A: string
    B: string
    C: string
    D: string
  }
  answer: string
}

export function getRandomQuestionsRenumbered(
  questions: Question[],
  count: number
): Question[] {
  const shuffled = [...questions]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled.slice(0, count).map((q, index) => ({
    ...q,
    number: index + 1, // Renumber from 1 to 100
  }))
}
