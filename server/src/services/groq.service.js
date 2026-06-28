import Groq from 'groq-sdk';
import env from '../config/env.js';

let groqClient = null;
if (env.GROQ_API_KEY) {
  try {
    groqClient = new Groq({ apiKey: env.GROQ_API_KEY });
    console.log('🤖 Groq AI service initialized successfully.');
  } catch (error) {
    console.error('❌ Failed to initialize Groq SDK:', error.message);
  }
}

export async function chatCompletion(messages, options = {}) {
  const model = options.model || 'llama-3.1-8b-instant';
  
  if (!groqClient) {
    console.log('🤖 Mock AI generating chat completion...');
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')?.content || '';
    const lastMsgLower = lastUserMessage.toLowerCase();
    
    if (lastMsgLower.includes('react')) {
      return "React is a declarative, efficient, and flexible JavaScript library for building user interfaces. Key concepts include Components, Props, State, Hooks (like useState, useEffect), and the Virtual DOM. Let me know if you want to practice React questions!";
    }
    if (lastMsgLower.includes('javascript') || lastMsgLower.includes('js')) {
      return "JavaScript is a high-level, single-threaded, garbage-collected runtime language. Key topics include Scope, Closures, Hoisting, Promises, Event Loop, and Prototypal Inheritance. How can I help you master JavaScript?";
    }
    if (lastMsgLower.includes('node') || lastMsgLower.includes('express')) {
      return "Node.js is an open-source, cross-platform JavaScript runtime environment built on Chrome's V8 engine. Express is a minimal and flexible Node.js web application framework. Let me know if you have questions on REST APIs or middleware!";
    }
    return `This is a mock PrepBot response. You asked: "${lastUserMessage}". Add GROQ_API_KEY in your .env file to enable live AI responses.`;
  }

  try {
    const response = await groqClient.chat.completions.create({
      messages,
      model,
      temperature: options.temperature !== undefined ? options.temperature : 0.7,
      max_tokens: options.max_tokens || 1024,
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error('❌ Groq chatCompletion error:', error.message);
    throw error;
  }
}

export async function generateJson(systemPrompt, userPrompt, options = {}) {
  const model = options.model || 'llama-3.1-8b-instant';

  if (!groqClient) {
    console.log('🤖 Mock AI generating structured JSON...');
    const sysLower = systemPrompt.toLowerCase();
    const userLower = userPrompt.toLowerCase();

    if (sysLower.includes('ats') || sysLower.includes('resume')) {
      return {
        score: 75,
        matchPercentage: 80,
        feedback: "Overall, your resume lists strong fundamental skills but lacks performance-oriented impact statements. Ensure your experience bullet points begin with active verbs and quantify results (e.g. 'reduced latency by 20%').",
        strengths: ["Strong foundation in Javascript/Node.js", "Well-formatted sections", "Clear contact details"],
        weaknesses: ["Lack of metrics/quantifiable success", "No mention of testing tools (Jest, Mocha)", "Missing CI/CD pipeline experience"],
        improvements: [
          { section: "Experience", suggestion: "Rewrite your tasks using the STAR method: Situation, Task, Action, Result." },
          { section: "Skills", suggestion: "Add relevant testing and DevOps keywords like Jest, Docker, and GitHub Actions." }
        ],
        parsedSkills: ["JavaScript", "HTML", "CSS", "Node.js", "Express", "Git", "React"]
      };
    }
    
    if (sysLower.includes('interview') && sysLower.includes('question')) {
      return {
        question: "Explain the Javascript event loop and the difference between microtasks and macrotasks.",
        context: "Testing understanding of Javascript runtime mechanics, async execution order, and browser/Node architecture.",
        tips: "Mention call stack, callback queue, microtask queue, Promise.then() priority over setTimeout()."
      };
    }

    if (sysLower.includes('grade') || sysLower.includes('score') || sysLower.includes('feedback')) {
      return {
        score: 8,
        feedback: "Very good explanation. You correctly identified that promises go to the microtask queue, which has higher priority. You could improve by mentioning how CPU-bound operations can block the event loop entirely.",
        keyPointsAddressed: ["Call Stack", "Microtasks run before Macrotasks", "Promises vs SetTimeout"],
        suggestedRevision: "In JavaScript, the Event Loop coordinates async operations. Call stack executes synchronous code. The microtask queue handles promises and runs immediately after the current operation. Macrotasks (timeouts, intervals) run in subsequent loop ticks."
      };
    }

    if (sysLower.includes('predict') || sysLower.includes('job')) {
      return {
        matchScore: 82,
        careerFit: "Software Engineer / Backend Developer",
        recommendations: ["Software Engineer", "Backend developer", "Fullstack Javascript Engineer"],
        skillsGap: ["TypeScript", "Docker", "AWS / Cloud Solutions", "Jest (Testing)"],
        advice: "Enhance your skills in TypeScript and Containerization (Docker). Your experience is a strong match for junior-to-mid web engineering roles."
      };
    }

    return {
      message: "Mock data fallback. Set GROQ_API_KEY in server/.env for live analysis.",
      status: "mock"
    };
  }

  try {
    const response = await groqClient.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model,
      response_format: { type: "json_object" },
      temperature: options.temperature !== undefined ? options.temperature : 0.1,
    });
    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.warn('⚠️ Groq JSON response format error, falling back to manual parsing...', error.message);
    try {
      const fallbackText = await chatCompletion([
        { role: 'system', content: systemPrompt + "\nOutput your answer strictly as a valid JSON string. Do not wrap in markdown syntax blocks." },
        { role: 'user', content: userPrompt }
      ], { temperature: 0.1 });
      const cleanJson = fallbackText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (innerError) {
      console.error('❌ Failed JSON fallback parsing:', innerError.message);
      throw innerError;
    }
  }
}
