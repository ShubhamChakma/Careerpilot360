import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { generateJson } from './groq.service.js';

/**
 * Extracts raw text from a resume buffer based on its MIME type or file extension.
 * @param {Buffer} buffer - File buffer
 * @param {string} mimeType - File MIME type
 * @param {string} [fileName] - File name
 * @returns {Promise<string>} Raw text of the resume
 */
export async function parseResume(buffer, mimeType, fileName = '') {
  if (!buffer || buffer.length === 0) {
    throw new Error('Resume file buffer is empty.');
  }

  const normalizedMime = (mimeType || '').toLowerCase();
  const lowerName = (fileName || '').toLowerCase();

  // 1. PDF Parsing
  if (normalizedMime === 'application/pdf' || lowerName.endsWith('.pdf')) {
    try {
      const data = await pdfParse(buffer);
      return data.text || '';
    } catch (error) {
      console.error('❌ PDF Parse failure:', error.message);
      throw new Error('Failed to parse PDF resume structure.');
    }
  }

  // 2. DOCX Parsing (Word Document OpenXML)
  if (
    normalizedMime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    normalizedMime === 'application/octet-stream' ||
    lowerName.endsWith('.docx')
  ) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      return result.value || '';
    } catch (error) {
      console.warn('⚠️ Mammoth DOCX Parse failure, falling back to raw:', error.message);
    }
  }

  // 3. Plain Text
  if (normalizedMime === 'text/plain' || lowerName.endsWith('.txt')) {
    return buffer.toString('utf-8');
  }

  // 4. Legacy DOC Parsing (Graceful Regex Fallback)
  try {
    const textContent = buffer.toString('utf-8');
    const cleanText = textContent.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    if (cleanText.trim().length > 100) {
      return cleanText;
    }
    
    // Binary DOC structure scanning fallback
    const binaryStr = buffer.toString('binary');
    const filtered = binaryStr.replace(/[^\x20-\x7E\x0A\x0D\x09]/g, ' ');
    return filtered.replace(/\s+/g, ' ').trim();
  } catch (error) {
    console.warn('⚠️ Raw text fallback parsing failed:', error.message);
    throw new Error('Failed to extract text content from the uploaded document.');
  }
}

/**
 * Sends raw resume text to Groq API to structure it into JSON.
 * @param {string} resumeText - Extracted resume content
 * @returns {Promise<object>} Structured resume object
 */
export async function parseResumeData(resumeText) {
  if (!resumeText || resumeText.trim().length === 0) {
    throw new Error('Resume content is empty. Cannot parse fields.');
  }

  const systemPrompt = `
    You are an expert AI resume parser and information extractor.
    Extract the following structured sections from the resume text:
    - name (string: candidate's full name, empty if not found)
    - email (string: email address, empty if not found)
    - phone (string: phone number, empty if not found)
    - skills (object with arrays of strings for these keys: languages, frameworks, libraries, databases, cloud, tools, softSkills)
    - experience (array of objects with keys: role, company, duration, description)
    - projects (array of objects with keys: title, technologies (array of strings), description)
    - education (array of objects with keys: degree, institution, year, score)
    - certifications (array of strings)
    - achievements (array of strings)
    - languages (array of strings: spoken/written languages like English, Spanish)
    - softSkills (array of strings)

    Ensure all properties are returned in a single valid JSON object.
    Do not add extra nested structures. Be precise.
  `;

  const userPrompt = `
    --- RESUME TEXT ---
    ${resumeText}
  `;

  try {
    const parsedData = await generateJson(systemPrompt, userPrompt);
    return parsedData;
  } catch (error) {
    console.error('❌ AI Resume data parsing failed:', error.message);
    throw new Error('Groq AI failed to structure the resume.');
  }
}
