import pdfParse from 'pdf-parse';

/**
 * Extracts raw text from a resume buffer based on its MIME type.
 * @param {Buffer} buffer - File buffer
 * @param {string} mimeType - File MIME type
 * @returns {Promise<string>} Raw text of the resume
 */
export async function parseResume(buffer, mimeType) {
  if (!buffer || buffer.length === 0) {
    throw new Error('Resume file buffer is empty.');
  }

  if (mimeType === 'application/pdf') {
    try {
      const data = await pdfParse(buffer);
      return data.text || '';
    } catch (error) {
      console.error('❌ PDF Parse failure:', error.message);
      throw new Error('Failed to parse PDF resume structure.');
    }
  }

  if (mimeType === 'text/plain') {
    return buffer.toString('utf-8');
  }

  // Graceful fallback for docx / doc (or other types) if parsed directly
  try {
    const textContent = buffer.toString('utf-8');
    // Basic cleaning of control characters
    return textContent.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  } catch (error) {
    console.warn('⚠️ Raw text fallback parsing failed:', error.message);
    return 'Could not parse binary content of DOCX. Please convert to PDF or TXT.';
  }
}
