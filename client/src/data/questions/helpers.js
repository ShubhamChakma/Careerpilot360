const STARTER = {
  c: `#include <stdio.h>\n\nint main() {\n    // your code here\n    return 0;\n}`,
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // your code here\n    return 0;\n}`,
  python: `def solve():\n    # your code here\n    pass\n\nif __name__ == "__main__":\n    solve()`,
  java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // your code here\n    }\n}`,
};

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

export function makeQuestion(topic, index, title, description, samples, hidden) {
  const slug = title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
  
  // Split hidden cases (typically 8) into 3 extra visible/public cases and 5 hidden cases
  const extraVisible = Array.isArray(hidden) ? hidden.slice(0, 3) : [];
  const finalHidden = Array.isArray(hidden) ? hidden.slice(3, 8) : [];

  return {
    id: slug,
    slug,
    title,
    topic,
    difficulty: DIFFICULTIES[index % 3],
    description,
    constraints: [
      "1 <= N <= 100000",
      "-1000000000 <= arr[i] <= 1000000000"
    ],
    starterCode: { ...STARTER },
    sampleTestCases: [...(samples || []), ...extraVisible],
    hiddenTestCases: finalHidden,
    examples: samples,
  };
}

export function defaultHidden(baseInput, baseOutput) {
  return Array.from({ length: 8 }, (_, i) => ({
    input: `${baseInput}${i}`,
    expectedOutput: `${baseOutput}${i}`,
  }));
}

export { STARTER };
