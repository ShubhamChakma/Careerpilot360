const STARTER = {
  c: `#include <stdio.h>\n\nint main() {\n    // your code here\n    return 0;\n}`,
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // your code here\n    return 0;\n}`,
  python: `def solve():\n    # your code here\n    pass\n\nif __name__ == "__main__":\n    solve()`,
  java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // your code here\n    }\n}`,
};

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

export function makeQuestion(topic, index, title, description, samples, hidden) {
  const slug = title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
  return {
    id: slug,
    slug,
    title,
    topic,
    difficulty: DIFFICULTIES[index % 3],
    description,
    constraints: '1 <= n <= 10^5',
    starterCode: { ...STARTER },
    sampleTestCases: samples,
    hiddenTestCases: hidden,
  };
}

export function defaultHidden(baseInput, baseOutput) {
  return Array.from({ length: 8 }, (_, i) => ({
    input: `${baseInput}${i}`,
    expectedOutput: `${baseOutput}${i}`,
  }));
}

export { STARTER };
