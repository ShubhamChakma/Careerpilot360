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
    throw new Error('Groq AI service is not initialized. Make sure GROQ_API_KEY is defined in your server/.env file.');
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
    throw new Error(`Groq API error: ${error.message}`);
  }
}

export async function generateJson(systemPrompt, userPrompt, options = {}) {
  const model = options.model || 'llama-3.1-8b-instant';

  if (!groqClient) {
    throw new Error('Groq AI service is not initialized. Make sure GROQ_API_KEY is defined in your server/.env file.');
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
      throw new Error(`Failed to parse Groq response as JSON: ${innerError.message}`);
    }
  }
}
