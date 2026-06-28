import { runCode } from '../services/compiler.service.js';
import { chatCompletion } from '../services/groq.service.js';

/**
 * Executes a self-test of the backend API modules (sandbox compiler & mock AI models).
 * Useful to verify environment configurations locally or during CI steps.
 * @returns {Promise<object>} Sanity check result
 */
export async function runSanityCheck() {
  console.log('🧪 Running backend integration sanity checks...');
  const checks = {
    compilerSandbox: false,
    aiService: false,
    timestamp: new Date().toISOString(),
    success: false
  };

  try {
    // 1. Validate that the VM JS execution sandbox evaluates correctly
    const compileResults = await runCode(
      'function solution(a, b) { return a + b; }',
      'javascript',
      [{ id: 'sanity_test', input: '[2, 3]', expectedOutput: '5' }]
    );
    
    if (compileResults && compileResults[0] && compileResults[0].status === 'passed') {
      checks.compilerSandbox = true;
    }

    // 2. Validate that the AI completion engine returns formatted responses
    const aiResponse = await chatCompletion([
      { role: 'user', content: 'respond only with the word React' }
    ]);
    
    if (aiResponse && aiResponse.toLowerCase().includes('react')) {
      checks.aiService = true;
    }

    checks.success = checks.compilerSandbox && checks.aiService;
  } catch (error) {
    console.error('❌ Sanity check failed with error:', error.message);
  }

  return checks;
}
