import { chatCompletion } from '../services/groq.service.js';

/**
 * Handles generalized chat prompts and study questions from PrepBot.
 * POST /api/ai/chat
 */
export async function chat(req, res, next) {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ 
        success: false, 
        error: { message: 'Invalid request body. Expected an array of chat messages.' } 
      });
    }

    if (messages.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: { message: 'Messages array cannot be empty.' } 
      });
    }

    const sanitizedMessages = messages.map(m => ({
      role: m.role,
      content: m.content
    }));

    const reply = await chatCompletion(sanitizedMessages);
    res.json({
      success: true,
      data: {
        reply,
        content: reply
      },
      content: reply,
      reply: reply
    });
  } catch (error) {
    next(error);
  }
}
