
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/questions/random', () => {
    return HttpResponse.json([
      {
        question: 'What is 2 + 2?',
        answers: [
          { text: '4', isCorrect: true },
          { text: '3', isCorrect: false },
          { text: '5', isCorrect: false },
        ],
      },
      {
        question: 'What is 3 * 4?',
        answers: [
          { text: '12', isCorrect: true },
          { text: '10', isCorrect: false },
          { text: '15', isCorrect: false },
        ],
      },
    ])
  })];
