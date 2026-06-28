import vm from 'vm';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

/**
 * Runs user-submitted code against a list of test cases.
 * @param {string} code - User's solution code
 * @param {string} language - Target programming language ('javascript' or 'python')
 * @param {Array} testCases - Test case specifications
 * @returns {Promise<Array>} Test case results list
 */
export async function runCode(code, language, testCases = []) {
  const results = [];

  for (const tc of testCases) {
    const input = tc.input || '';
    const expected = (tc.expectedOutput || '').trim();
    
    let stdout = '';
    let stderr = '';
    let status = 'failed';
    let error = null;
    const startTime = process.hrtime();

    try {
      if (language === 'javascript' || language === 'js') {
        const consoleMock = {
          log: (...args) => { 
            stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ') + '\n'; 
          },
          error: (...args) => { 
            stderr += args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ') + '\n'; 
          }
        };

        const sandbox = {
          console: consoleMock,
          Buffer,
          process: { env: {} }
        };

        let parsedInput = [];
        try {
          if (input.startsWith('[') && input.endsWith(']')) {
            parsedInput = JSON.parse(input);
          } else if (input.trim() !== '') {
            parsedInput = [input];
          }
        } catch (e) {
          parsedInput = [input];
        }

        // Auto-run wrapper to call 'solution' or 'main' if available
        let executionCode = code + `\n
        if (typeof solution === 'function') {
          const res = solution(...${JSON.stringify(parsedInput)});
          if (res !== undefined) console.log(res);
        } else if (typeof main === 'function') {
          const res = main(...${JSON.stringify(parsedInput)});
          if (res !== undefined) console.log(res);
        }
        `;

        const script = new vm.Script(executionCode);
        // Execute inside vm with 2 seconds timeout
        script.runInNewContext(sandbox, { timeout: 2000 });
        
        const actualOutput = stdout.trim();
        status = (actualOutput === expected) ? 'passed' : 'failed';
      } 
      else if (language === 'python' || language === 'py') {
        // Run python using temporary file inside workspace scratch directory
        const scratchDir = path.join(process.cwd(), 'scratch');
        if (!fs.existsSync(scratchDir)) {
          fs.mkdirSync(scratchDir, { recursive: true });
        }

        const tempFileName = `exec_${Date.now()}_${Math.random().toString(36).substring(7)}.py`;
        const tempFilePath = path.join(scratchDir, tempFileName);

        let parsedInput = [];
        try {
          if (input.startsWith('[') && input.endsWith(']')) {
            parsedInput = JSON.parse(input);
          } else if (input.trim() !== '') {
            parsedInput = [input];
          }
        } catch (e) {
          parsedInput = [input];
        }

        const pythonCode = code + `\n
# Auto-run wrapper
import json
import sys

try:
    if 'solution' in globals() and callable(globals()['solution']):
        res = solution(*${JSON.stringify(parsedInput)})
        if res is not None:
            print(res)
    elif 'main' in globals() and callable(globals()['main']):
        res = main(*${JSON.stringify(parsedInput)})
        if res is not None:
            print(res)
except Exception as e:
    print(e, file=sys.stderr)
`;

        fs.writeFileSync(tempFilePath, pythonCode, 'utf-8');

        try {
          const { stdout: pyOut, stderr: pyErr } = await execAsync(`python "${tempFilePath}"`, { timeout: 2000 });
          stdout = pyOut;
          stderr = pyErr;
          status = (stdout.trim() === expected) ? 'passed' : 'failed';
        } catch (execErr) {
          // If python command doesn't exist
          if (execErr.code === 'ENOENT' || execErr.message.includes('not found') || execErr.message.includes('not recognized')) {
            stderr = 'Python runtime not installed or not in PATH on the server.';
          } else {
            stderr = execErr.stderr || execErr.message;
          }
          status = 'error';
        } finally {
          if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
          }
        }
      } 
      else {
        throw new Error(`Execution for language '${language}' is not supported.`);
      }
    } catch (err) {
      error = err.message;
      status = 'error';
    }

    const diff = process.hrtime(startTime);
    const durationMs = (diff[0] * 1e9 + diff[1]) / 1e6;

    results.push({
      testCaseId: tc.id || Math.random().toString(36).substring(7),
      input,
      expected,
      actual: stdout.trim(),
      error: error || stderr.trim() || undefined,
      status,
      timeMs: Math.round(durationMs)
    });
  }

  return results;
}
