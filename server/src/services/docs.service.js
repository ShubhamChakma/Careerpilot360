import { chatCompletion } from './groq.service.js';
import { db } from '../config/firebase.js';

const OFFICIAL_LINKS = [
  {
    id: "frontend",
    category: "Frontend Development",
    links: [
      { id: "react", name: "React Docs", url: "https://react.dev", description: "The official guide for React and modern UI hooks." },
      { id: "mdn", name: "MDN Web Docs", url: "https://developer.mozilla.org", description: "Comprehensive Javascript, HTML, and CSS web standards guides." },
      { id: "vite", name: "Vite Guide", url: "https://vitejs.dev", description: "Next-gen frontend build tool documentation." },
      { id: "tailwind", name: "Tailwind CSS", url: "https://tailwindcss.com", description: "A utility-first CSS framework design system." }
    ]
  },
  {
    id: "backend",
    category: "Backend & Cloud",
    links: [
      { id: "node", name: "Node.js Docs", url: "https://nodejs.org/docs", description: "Official Node.js runtime developer references." },
      { id: "express", name: "Express Guide", url: "https://expressjs.com", description: "Express web framework for REST API construction." },
      { id: "redis", name: "Redis Documentation", url: "https://redis.io/docs", description: "In-memory key-value database caching strategies." },
      { id: "firebase", name: "Firebase Admin", url: "https://firebase.google.com/docs/admin/setup", description: "Firebase SDK server integration tutorials." }
    ]
  },
  {
    id: "languages",
    category: "Programming Languages",
    links: [
      { id: "python", name: "Python 3 Docs", url: "https://docs.python.org/3/", description: "Official documentation for Python language features." },
      { id: "typescript", name: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/", description: "Typed superset of JavaScript language specifications." }
    ]
  }
];

/**
 * Returns structured list of official doc links.
 */
export async function getOfficialLinks() {
  return OFFICIAL_LINKS;
}

/**
 * Returns content page for a documentation topic, generating dynamically if not cached.
 * @param {string} topic - Topic ID slug
 */
export async function getTutorialByTopic(topic) {
  const t = topic?.toLowerCase().trim();
  if (!t) {
    throw new Error('Topic query is empty');
  }

  // 1. Check cache database
  try {
    const docRef = db.collection('tutorials_cache').doc(t);
    const docSnap = await docRef.get();
    if (docSnap.exists) {
      console.log(`[DocsHub Cache] Hit for: ${t}`);
      return docSnap.data();
    }
  } catch (dbErr) {
    console.warn(`[DocsHub Cache] Read failure (ignoring):`, dbErr.message);
  }

  // 2. Cache miss -> Call live Groq Cloud API
  console.log(`[DocsHub Cache] Miss for: ${t}. Invoking Groq dynamic compiler...`);

  const prompt = `You are a Principal Software Engineer, Algorithm Researcher, and Coding Coach.
Write a comprehensive, extremely detailed, and high-quality study guide for the technical topic: "${topic}".
The target audience consists of candidates preparing for Online Assessments (OA) and FAANG coding interviews.

Your guide must be formatted in clean, professional Markdown and strictly cover the following sections in detail:

## Concept Overview
Explain the core concept in clear, simple terms.

## Core Theory
Deep dive into the underlying mechanics, structures, architectures, or designs.

## Important Formulas & Rules
If applicable (e.g. tree node counts, complexity properties, subnet calculation, recursion limits). If not applicable, explicitly state "Not applicable to this topic".

## Time & Space Complexity
Provide a structured Big-O analysis of core operations, best/average/worst case.

## OA Coding Patterns
Describe 2 common problem-solving patterns or formats frequently seen in Online Assessments (e.g. hash counters, recursion pruning, slow/fast pointers).

## Common Interview Questions with Answers
Provide 3 actual technical interview questions with brief, detailed answers.

## Frequently Asked Company Questions
List companies (e.g. Google, Meta, Amazon) known for asking this and in what typical contexts.

## Step-by-Step Approach
Provide a standard, logical workflow to tackle problems involving this topic.

## Common Mistakes
Highlight traps, bugs, or edge cases that candidates fall into.

## Optimized Solutions
Discuss structural code design and memory optimizations (e.g. inplace arrays, bitmasks, space reuse).

## Tips & Tricks
 optimization shortcuts or cheat sheet takeaways.

## Revision Notes
Provide a bulleted list of 5 essential facts candidates should revise 10 minutes before the interview.

## Practice Problems
List 3 mock problem challenges:
1. [Easy] Title and brief description.
2. [Medium] Title and brief description.
3. [Hard] Title and brief description.

## Recommended LeetCode Questions
List 3-5 specific LeetCode problem titles and IDs (e.g. "Two Sum - #1").

Ensure that code blocks have proper syntax tags (e.g. \`\`\`cpp or \`\`\`javascript). Be thorough and write complete guides with no placeholders.`;

  try {
    const aiContent = await chatCompletion([
      { role: 'system', content: 'You are a professional computer science compiler.' },
      { role: 'user', content: prompt }
    ]);

    const cleanTitle = topic.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const result = {
      title: cleanTitle,
      content: aiContent,
      createdAt: new Date().toISOString()
    };

    // Store in cache database asynchronously
    db.collection('tutorials_cache').doc(t).set(result)
      .then(() => console.log(`[DocsHub Cache] Saved entry for: ${t}`))
      .catch((saveErr) => console.warn(`[DocsHub Cache] Write failure:`, saveErr.message));

    return result;
  } catch (err) {
    console.error(`[DocsHub] Groq compilation failed for: ${t}:`, err.message);
    throw err;
  }
}
