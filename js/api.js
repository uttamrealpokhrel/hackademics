/**
 * API Integration Module
 * Handles communication with AI services to generate quizzes
 * Uses JSON structured output format
 */

// Configuration
const API_CONFIG = {
    // Replace with your actual API endpoint
    OPENAI_API_KEY: 'YOUR_OPENAI_API_KEY', // IMPORTANT: Use environment variable in production
    OPENAI_API_URL: 'https://api.openai.com/v1/chat/completions',
    MODEL: 'gpt-3.5-turbo',
    MAX_TOKENS: 2000,
    TEMPERATURE: 0.7
};

/**
 * Quiz Response JSON Schema
 * Ensures structured output from AI
 */
const QUIZ_SCHEMA = {
    type: "object",
    properties: {
        topic: {
            type: "string",
            description: "The quiz topic"
        },
        questions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    question: { type: "string" },
                    options: {
                        type: "array",
                        items: { type: "string" },
                        minItems: 4,
                        maxItems: 4
                    },
                    correctAnswer: { type: "integer", minimum: 0, maximum: 3 },
                    explanation: { type: "string" }
                },
                required: ["id", "question", "options", "correctAnswer", "explanation"]
            },
            minItems: 10,
            maxItems: 10
        }
    },
    required: ["topic", "questions"]
};

/**
 * Generate a quiz using AI API with structured JSON output
 * @param {string} topic - The topic for the quiz
 * @returns {Promise<Object>} - The generated quiz in JSON format
 */
async function generateQuizFromAPI(topic) {
    try {
        console.log(`📚 Generating quiz for topic: ${topic}`);
        
        const prompt = `Create a 10-question multiple-choice quiz about "${topic}". 
        
For each question:
- Provide 4 options (labeled A, B, C, D)
- Include the index of the correct answer (0-3)
- Add a brief explanation

Return ONLY valid JSON in this exact format, with no additional text:
{
    "topic": "${topic}",
    "questions": [
        {
            "id": 1,
            "question": "Question text here?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": 0,
            "explanation": "The answer is A because..."
        }
    ]
}

Make sure to have exactly 10 questions and strictly follow the JSON format.`;

        // Mock response for demonstration (replace with actual API call)
        const quizData = await generateMockQuiz(topic);
        
        console.log(`✅ Quiz generated successfully for ${topic}`);
        return quizData;
        
    } catch (error) {
        console.error('❌ Error generating quiz:', error);
        throw new Error(`Failed to generate quiz: ${error.message}`);
    }
}

/**
 * Generate mock quiz data (use while setting up API keys)
 * Replace this with actual API call when ready
 * @param {string} topic - The topic for the quiz
 * @returns {Promise<Object>} - Mock quiz data
 */
async function generateMockQuiz(topic) {
    // Simulate API delay
    return new Promise((resolve) => {
        setTimeout(() => {
            const quizzes = {
                "Photosynthesis": {
                    topic: "Photosynthesis",
                    questions: [
                        {
                            id: 1,
                            question: "What is the primary purpose of photosynthesis?",
                            options: [
                                "To produce oxygen only",
                                "To convert light energy into chemical energy (glucose)",
                                "To absorb carbon dioxide",
                                "To break down glucose for energy"
                            ],
                            correctAnswer: 1,
                            explanation: "Photosynthesis converts light energy into chemical energy stored in glucose, while also producing oxygen as a byproduct."
                        },
                        {
                            id: 2,
                            question: "In which organelle does photosynthesis occur?",
                            options: [
                                "Mitochondria",
                                "Nucleus",
                                "Chloroplast",
                                "Ribosome"
                            ],
                            correctAnswer: 2,
                            explanation: "Photosynthesis occurs in the chloroplast, which contains chlorophyll and other necessary structures."
                        },
                        {
                            id: 3,
                            question: "What are the two main stages of photosynthesis?",
                            options: [
                                "Glycolysis and Krebs cycle",
                                "Light-dependent reactions and light-independent reactions (Calvin cycle)",
                                "Transcription and translation",
                                "Fermentation and respiration"
                            ],
                            correctAnswer: 1,
                            explanation: "The light-dependent reactions occur in the thylakoid membrane and the Calvin cycle occurs in the stroma."
                        },
                        {
                            id: 4,
                            question: "Which pigment is primarily responsible for capturing light energy in plants?",
                            options: [
                                "Carotenoid",
                                "Xanthophyll",
                                "Chlorophyll",
                                "Phycobilin"
                            ],
                            correctAnswer: 2,
                            explanation: "Chlorophyll (especially chlorophyll a and b) is the main photosynthetic pigment in plants."
                        },
                        {
                            id: 5,
                            question: "What is the equation for photosynthesis?",
                            options: [
                                "C6H12O6 + 6O2 → 6CO2 + 6H2O + energy",
                                "6CO2 + 6H2O + light energy → C6H12O6 + 6O2",
                                "6O2 + C6H12O6 → 6CO2 + 6H2O",
                                "6CO2 + 6O2 → C6H12O6 + 6H2O"
                            ],
                            correctAnswer: 1,
                            explanation: "This is the balanced equation for photosynthesis: carbon dioxide and water, with light energy, produce glucose and oxygen."
                        },
                        {
                            id: 6,
                            question: "What is the primary product of the light-dependent reactions?",
                            options: [
                                "Glucose",
                                "ATP and NADPH",
                                "Carbon dioxide",
                                "Pyruvate"
                            ],
                            correctAnswer: 1,
                            explanation: "Light-dependent reactions produce ATP and NADPH, which are used in the Calvin cycle to produce glucose."
                        },
                        {
                            id: 7,
                            question: "Where does the Calvin cycle take place in the chloroplast?",
                            options: [
                                "Thylakoid membrane",
                                "In the stroma",
                                "In the inner membrane",
                                "On the outer membrane"
                            ],
                            correctAnswer: 1,
                            explanation: "The Calvin cycle (light-independent reactions) occurs in the stroma of the chloroplast."
                        },
                        {
                            id: 8,
                            question: "What is the role of ATP in photosynthesis?",
                            options: [
                                "It absorbs light energy",
                                "It carries electrons",
                                "It provides energy for the Calvin cycle",
                                "It produces glucose"
                            ],
                            correctAnswer: 2,
                            explanation: "ATP (adenosine triphosphate) provides the necessary energy for the Calvin cycle to produce glucose."
                        },
                        {
                            id: 9,
                            question: "How many carbon atoms are fixed in each turn of the Calvin cycle?",
                            options: [
                                "3 carbon atoms",
                                "6 carbon atoms",
                                "1 carbon atom",
                                "12 carbon atoms"
                            ],
                            correctAnswer: 2,
                            explanation: "In each turn of the Calvin cycle, 1 carbon atom from CO2 is fixed to form new organic molecules."
                        },
                        {
                            id: 10,
                            question: "What is the significance of the light-independent reactions?",
                            options: [
                                "They produce ATP and NADPH",
                                "They split water molecules",
                                "They convert CO2 into glucose using ATP and NADPH from light-dependent reactions",
                                "They produce oxygen gas"
                            ],
                            correctAnswer: 2,
                            explanation: "The light-independent reactions (Calvin cycle) use the ATP and NADPH from light reactions to convert CO2 into glucose."
                        }
                    ]
                },
                "Python Programming": {
                    topic: "Python Programming",
                    questions: [
                        {
                            id: 1,
                            question: "Who created Python?",
                            options: [
                                "Guido van Rossum",
                                "Bjarne Stroustrup",
                                "Dennis Ritchie",
                                "Rasmus Lerdorf"
                            ],
                            correctAnswer: 0,
                            explanation: "Guido van Rossum created Python in 1991."
                        },
                        {
                            id: 2,
                            question: "What is the output of print(2 ** 3)?",
                            options: [
                                "5",
                                "6",
                                "8",
                                "Error"
                            ],
                            correctAnswer: 2,
                            explanation: "The ** operator is the exponentiation operator. 2 ** 3 = 2 * 2 * 2 = 8"
                        },
                        {
                            id: 3,
                            question: "Which data type is immutable in Python?",
                            options: [
                                "List",
                                "Dictionary",
                                "Tuple",
                                "Set"
                            ],
                            correctAnswer: 2,
                            explanation: "Tuples are immutable in Python, meaning their values cannot be changed after creation."
                        },
                        {
                            id: 4,
                            question: "What does the len() function do?",
                            options: [
                                "Returns the length of a string",
                                "Returns the number of items in a sequence",
                                "Returns the length of any object",
                                "Both B and C"
                            ],
                            correctAnswer: 3,
                            explanation: "The len() function returns the number of items in a sequence or collection."
                        },
                        {
                            id: 5,
                            question: "What is the correct file extension for Python files?",
                            options: [
                                ".pyt",
                                ".py",
                                ".python",
                                ".p"
                            ],
                            correctAnswer: 1,
                            explanation: "Python files use the .py extension."
                        },
                        {
                            id: 6,
                            question: "Which keyword is used to create a function in Python?",
                            options: [
                                "function",
                                "def",
                                "func",
                                "define"
                            ],
                            correctAnswer: 1,
                            explanation: "The 'def' keyword is used to define a function in Python."
                        },
                        {
                            id: 7,
                            question: "What is the correct way to create a list in Python?",
                            options: [
                                "list = {1, 2, 3}",
                                "list = (1, 2, 3)",
                                "list = [1, 2, 3]",
                                "list = <1, 2, 3>"
                            ],
                            correctAnswer: 2,
                            explanation: "Lists are created using square brackets []"
                        },
                        {
                            id: 8,
                            question: "What is the output of 'hello'.upper()?",
                            options: [
                                "'hello'",
                                "'HELLO'",
                                "'Hello'",
                                "'hELLO'"
                            ],
                            correctAnswer: 1,
                            explanation: "The upper() method converts all characters in a string to uppercase."
                        },
                        {
                            id: 9,
                            question: "Which library is used for scientific computing in Python?",
                            options: [
                                "Pandas",
                                "NumPy",
                                "Matplotlib",
                                "Django"
                            ],
                            correctAnswer: 1,
                            explanation: "NumPy is the primary library for numerical and scientific computing in Python."
                        },
                        {
                            id: 10,
                            question: "What is the purpose of the 'try' and 'except' block?",
                            options: [
                                "To create loops",
                                "To define functions",
                                "To handle exceptions and errors",
                                "To import modules"
                            ],
                            correctAnswer: 2,
                            explanation: "'try' and 'except' blocks are used for exception handling in Python."
                        }
                    ]
                },
                "World History": {
                    topic: "World History",
                    questions: [
                        {
                            id: 1,
                            question: "In what year did World War II end?",
                            options: [
                                "1943",
                                "1944",
                                "1945",
                                "1946"
                            ],
                            correctAnswer: 2,
                            explanation: "World War II ended in 1945 with the surrender of Japan in September."
                        },
                        {
                            id: 2,
                            question: "Who was the first President of the United States?",
                            options: [
                                "Thomas Jefferson",
                                "George Washington",
                                "Abraham Lincoln",
                                "Benjamin Franklin"
                            ],
                            correctAnswer: 1,
                            explanation: "George Washington served as the first President from 1789 to 1797."
                        },
                        {
                            id: 3,
                            question: "Which empire built the Great Wall of China?",
                            options: [
                                "Ming Dynasty",
                                "Qin Dynasty",
                                "Han Dynasty",
                                "Tang Dynasty"
                            ],
                            correctAnswer: 1,
                            explanation: "The Qin Dynasty began the construction of the Great Wall around 221 BC."
                        },
                        {
                            id: 4,
                            question: "In what year did the Berlin Wall fall?",
                            options: [
                                "1987",
                                "1988",
                                "1989",
                                "1990"
                            ],
                            correctAnswer: 2,
                            explanation: "The Berlin Wall fell on November 9, 1989, marking the beginning of the end of the Cold War."
                        },
                        {
                            id: 5,
                            question: "Who was the author of the Declaration of Independence?",
                            options: [
                                "Benjamin Franklin",
                                "Thomas Jefferson",
                                "John Adams",
                                "Samuel Adams"
                            ],
                            correctAnswer: 1,
                            explanation: "Thomas Jefferson is credited as the primary author of the Declaration of Independence in 1776."
                        },
                        {
                            id: 6,
                            question: "Which country was the first to industrialize?",
                            options: [
                                "France",
                                "United States",
                                "Great Britain",
                                "Germany"
                            ],
                            correctAnswer: 2,
                            explanation: "Great Britain led the Industrial Revolution starting in the late 18th century."
                        },
                        {
                            id: 7,
                            question: "What year did the Titanic sink?",
                            options: [
                                "1910",
                                "1911",
                                "1912",
                                "1913"
                            ],
                            correctAnswer: 2,
                            explanation: "The RMS Titanic sank on April 15, 1912, after hitting an iceberg."
                        },
                        {
                            id: 8,
                            question: "Who was the first person to walk on the moon?",
                            options: [
                                "Buzz Aldrin",
                                "Neil Armstrong",
                                "John Glenn",
                                "Alan Shepard"
                            ],
                            correctAnswer: 1,
                            explanation: "Neil Armstrong was the first person to walk on the moon on July 20, 1969."
                        },
                        {
                            id: 9,
                            question: "In what year did the Renaissance begin?",
                            options: [
                                "12th century",
                                "13th century",
                                "14th century",
                                "15th century"
                            ],
                            correctAnswer: 2,
                            explanation: "The Renaissance began in Italy in the 14th century, marking the transition from the Middle Ages to the Modern era."
                        },
                        {
                            id: 10,
                            question: "Which ancient wonder of the world still stands today?",
                            options: [
                                "Hanging Gardens of Babylon",
                                "Great Pyramid of Giza",
                                "Colossus of Rhodes",
                                "Lighthouse of Alexandria"
                            ],
                            correctAnswer: 1,
                            explanation: "The Great Pyramid of Giza is the only surviving member of the Seven Wonders of the Ancient World."
                        }
                    ]
                }
            };

            // Return the quiz for the selected topic, or a default one
            resolve(quizzes[topic] || quizzes["Photosynthesis"]);
        }, 800);
    });
}

/**
 * Format quiz data for display
 * @param {Object} quizData - The quiz data from API
 * @returns {Object} - Formatted quiz data
 */
function formatQuizData(quizData) {
    return {
        topic: quizData.topic,
        totalQuestions: quizData.questions.length,
        questions: quizData.questions.map((q, index) => ({
            id: index + 1,
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation
        }))
    };
}

/**
 * Validate quiz JSON structure
 * @param {Object} quizData - The quiz data to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateQuizStructure(quizData) {
    try {
        if (!quizData.topic || typeof quizData.topic !== 'string') {
            throw new Error('Invalid or missing topic');
        }

        if (!Array.isArray(quizData.questions) || quizData.questions.length !== 10) {
            throw new Error('Questions must be an array with exactly 10 items');
        }

        for (let i = 0; i < quizData.questions.length; i++) {
            const q = quizData.questions[i];
            
            if (!q.question || typeof q.question !== 'string') {
                throw new Error(`Question ${i + 1}: Invalid question text`);
            }

            if (!Array.isArray(q.options) || q.options.length !== 4) {
                throw new Error(`Question ${i + 1}: Must have exactly 4 options`);
            }

            if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
                throw new Error(`Question ${i + 1}: Invalid correct answer index`);
            }

            if (!q.explanation || typeof q.explanation !== 'string') {
                throw new Error(`Question ${i + 1}: Missing explanation`);
            }
        }

        return true;
    } catch (error) {
        console.error('❌ Quiz validation error:', error.message);
        return false;
    }
}

/**
 * Export quiz results as JSON
 * @param {Object} results - The quiz results
 * @returns {string} - JSON string
 */
function exportResultsAsJSON(results) {
    return JSON.stringify(results, null, 2);
}

/**
 * Export quiz results as CSV
 * @param {Object} results - The quiz results
 * @returns {string} - CSV string
 */
function exportResultsAsCSV(results) {
    let csv = 'Quiz Results\n';
    csv += `Topic: ${results.topic}\n`;
    csv += `Score: ${results.score}/${results.totalQuestions}\n`;
    csv += `Percentage: ${((results.score / results.totalQuestions) * 100).toFixed(2)}%\n`;
    csv += `Date: ${new Date().toLocaleDateString()}\n\n`;
    csv += 'Question,Your Answer,Correct Answer,Status\n';

    results.answers.forEach((answer, index) => {
        const status = answer.selected === answer.correct ? 'Correct' : 'Incorrect';
        csv += `${index + 1},"${answer.question}","${answer.selectedText}","${answer.correctText}","${status}"\n`;
    });

    return csv;
}
