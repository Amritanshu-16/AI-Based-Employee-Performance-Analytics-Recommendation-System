import OpenAI from 'openai';
import Employee from '../models/Employee.js';

// OpenRouter setup (compatible with OpenAI)
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const getRecommendations = async (req, res) => {
  try {
    const employees = await Employee.find({});

    if (employees.length === 0) {
      return res.status(400).json({ message: "No employees found to analyze." });
    }

    const employeeData = employees.map(emp => ({
      name: emp.name,
      department: emp.department,
      skills: emp.skills,
      performanceScore: emp.performanceScore,
      experience: emp.experience
    }));

    const prompt = `
    You are an expert HR Analyst and AI Recommendation Engine.
    Analyze the following employee data:
    ${JSON.stringify(employeeData)}
    
    For each employee, provide:
    1. Employee Ranking (1 being the highest performance/value).
    2. AI Score (out of 100 based on their performance and experience).
    3. Promotion Suggestion (Yes/No with a short reason).
    4. Training Recommendation (Specific skill areas to improve).
    5. Strengths (1-2 key strengths).
    6. Weaknesses (1-2 areas of improvement).
    7. Performance Analysis (A brief summary).
    8. HR Feedback Summary.
    
    Return the response EXCLUSIVELY as a valid JSON array containing objects. Do NOT wrap the JSON in Markdown formatting like \`\`\`json. Return just the raw JSON. The format should be:
    [
      {
        "name": "Employee Name",
        "ranking": 1,
        "aiScore": 95,
        "promotionSuggestion": "Yes, ready for senior role",
        "trainingRecommendation": "Leadership training",
        "strengths": ["React", "Node.js"],
        "weaknesses": ["Cloud deployment"],
        "performanceAnalysis": "Excellent output consistently.",
        "hrFeedback": "Highly valuable team member."
      }
    ]
    `;

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an AI HR system that outputs only valid JSON arrays." },
        { role: "user", content: prompt }
      ]
    });

    let rawResponse = completion.choices[0].message.content.trim();
    // In case the AI returns markdown despite instructions
    if (rawResponse.startsWith('```json')) {
      rawResponse = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    }

    const recommendations = JSON.parse(rawResponse);
    res.json(recommendations);
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ message: "Error generating recommendations. Ensure API key is correct.", error: error.message });
  }
};
