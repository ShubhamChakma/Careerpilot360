import env from '../config/env.js';

const COMPILER_URL = env.COMPILER_SERVER_URL || 'http://localhost:3000';

/**
 * Proxies a compile/run request to the Compiler_Server.
 * POST /api/compile
 * Body: { code, language, questionId, mode }
 */
export async function submitCode(req, res, next) {
  try {
    const { code, language, questionId, mode } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: { message: 'Code snippet is required for compilation.' }
      });
    }

    if (!language) {
      return res.status(400).json({
        success: false,
        error: { message: 'Language selection (cpp, c, java, python) is required.' }
      });
    }

    if (!questionId) {
      return res.status(400).json({
        success: false,
        error: { message: 'questionId (problem slug) is required.' }
      });
    }

    const endpoint = mode === 'submit' ? '/submit' : '/run';
    const authHeader = req.headers.authorization || '';

    console.log(`[proxy] Forwarding compile request to ${COMPILER_URL}${endpoint} for question: ${questionId}`);

    const compilerRes = await fetch(`${COMPILER_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({
        problemId: questionId,
        code,
        language,
      }),
    });

    const contentType = compilerRes.headers.get('content-type') || '';
    let data;
    if (contentType.includes('application/json')) {
      data = await compilerRes.json();
    } else {
      const text = await compilerRes.text();
      data = { success: false, message: text || 'Non-JSON response received from compiler server.' };
    }

    return res.status(compilerRes.status).json({
      success: compilerRes.ok,
      ...data,
    });

  } catch (error) {
    console.error('[proxy] Error forwarding request to compiler:', error.message);
    return res.status(503).json({
      success: false,
      error: { message: `Compiler service is unavailable: ${error.message}` }
    });
  }
}

/**
 * Health-check passthrough to the compiler server.
 * GET /api/compile/health
 */
export async function compilerHealth(req, res, next) {
  try {
    const compilerRes = await fetch(`${COMPILER_URL}/health`);
    const data = await compilerRes.json();
    return res.status(compilerRes.status).json(data);
  } catch (error) {
    return res.status(503).json({ status: 'DOWN', message: `Compiler_Server unreachable: ${error.message}` });
  }
}
