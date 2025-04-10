class QuestionGenerator {
  constructor() {
    // No API key or base URL needed since we're generating locally
  }

  async generateQuestions(skill) {
    try {
      // Basic question templates for different skills
      const questionTemplates = {
        default: [
          {
            question: `What is a fundamental concept in ${skill}?`,
            options: [
              "Basic Concept A",
              "Basic Concept B",
              "Basic Concept C",
              "Basic Concept D"
            ],
            correctAnswer: "Basic Concept A"
          },
          {
            question: `Which tool is commonly used in ${skill}?`,
            options: [
              "Tool A",
              "Tool B",
              "Tool C",
              "Tool D"
            ],
            correctAnswer: "Tool B"
          },
          {
            question: `What is a key benefit of ${skill}?`,
            options: [
              "Benefit A",
              "Benefit B",
              "Benefit C",
              "Benefit D"
            ],
            correctAnswer: "Benefit C"
          }
        ]
      };

      // Add specific skill-based questions if desired
      const skillSpecific = {
        "javascript": [
          {
            question: "What keyword is used to declare a variable in JavaScript?",
            options: ["var", "int", "string", "float"],
            correctAnswer: "var"
          },
          {
            question: "Which method adds an element to the end of an array?",
            options: ["push()", "pop()", "shift()", "unshift()"],
            correctAnswer: "push()"
          },
          {
            question: "What does '=== ' compare in JavaScript?",
            options: [
              "Value only",
              "Type only",
              "Value and type",
              "Reference only"
            ],
            correctAnswer: "Value and type"
          }
        ]
        // Add more skills as needed
      };

      // Use skill-specific questions if available, otherwise fall back to default
      const questions = skillSpecific[skill.toLowerCase()] || 
                      questionTemplates.default.map(q => ({
                        ...q,
                        question: q.question.replace("${skill}", skill)
                      }));

      return questions;
    } catch (error) {
      console.error('Error generating questions:', error.message);
      throw new Error('Failed to generate questions');
    }
  }
}

export default QuestionGenerator;

// Usage example:
async function testGenerator() {
  const generator = new QuestionGenerator();
  try {
    const questions = await generator.generateQuestions("javascript");
    console.log(JSON.stringify(questions, null, 2));
  } catch (error) {
    console.error(error.message);
  }
}

// testGenerator();