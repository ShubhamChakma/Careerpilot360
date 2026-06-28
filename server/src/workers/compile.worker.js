import { compileQueue } from '../services/queue.service.js';
import { runCode } from '../services/compiler.service.js';

/**
 * Initializes the background compiler worker, connecting it to the job queue.
 */
export function startCompilerWorker() {
  console.log('👷 Background Compiler Worker initialized and listening for tasks...');
  
  compileQueue.process(async (jobData) => {
    const { code, language, testCases } = jobData;
    console.log(`⏳ Processing queued compile job (Language: ${language})...`);
    
    try {
      const results = await runCode(code, language, testCases);
      console.log(`✅ Job processed successfully. Passed cases: ${results.filter(r => r.status === 'passed').length}/${results.length}`);
      return results;
    } catch (err) {
      console.error('❌ Failed processing compile job:', err.message);
      throw err;
    }
  });
}
