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

const TOPIC_TUTORIALS = {
  react: {
    title: "React Fundamentals",
    content: "React is a component-based UI library. Key elements include component composition, declarative UI rendering, states (via useState), and side-effects (via useEffect). Use pure component functions and handle props flow from parent to child.",
    resources: ["https://react.dev/learn"]
  },
  node: {
    title: "Node.js Event Loop",
    content: "Node.js runs single-threaded, using non-blocking asynchronous calls. The event loop prioritizes callbacks from the Call Stack, executing Microtasks (Promises) before Macrotasks (timers like setTimeout). Do not block the main thread with heavy synchronous computations.",
    resources: ["https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick"]
  },
  redis: {
    title: "Redis Caching Strategies",
    content: "Redis stores key-value pairs in memory for sub-millisecond retrieval. Common patterns include Cache-Aside (checking cache first, then querying DB and updating cache) and setting short Expiring Times (TTL) to keep data fresh and limit memory exhaustion.",
    resources: ["https://redis.io/docs/develop/data-types/"]
  }
};

/**
 * Returns structured list of official doc links.
 */
export async function getOfficialLinks() {
  return OFFICIAL_LINKS;
}

/**
 * Returns content page for a documentation topic.
 * @param {string} topic - Topic ID
 */
export async function getTutorialByTopic(topic) {
  const t = topic?.toLowerCase();
  if (TOPIC_TUTORIALS[t]) {
    return TOPIC_TUTORIALS[t];
  }
  return {
    title: `${topic.charAt(0).toUpperCase() + topic.slice(1)} Tutorial`,
    content: `Learn all about ${topic} development, best practices, and integration strategies. Detailed guide is being generated...`,
    resources: []
  };
}
