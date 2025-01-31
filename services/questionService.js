// services/questionService.js
class QuestionService {
    static async fetchQuestions(skill) {
      try {
        const response = await fetch(
          `/api/generate-questions?skill=${encodeURIComponent(skill)}`
        );
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch questions');
        }
        
        return data.questions;
      } catch (error) {
        console.error('Question Service Error:', error);
        throw error;
      }
    }
  }
  
  export default QuestionService;