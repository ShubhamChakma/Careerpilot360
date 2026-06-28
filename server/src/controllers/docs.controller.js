import { getOfficialLinks, getTutorialByTopic } from '../services/docs.service.js';

/**
 * Returns categorized official developer documentation links.
 * GET /api/docs/links
 */
export async function getLinks(req, res, next) {
  try {
    const links = await getOfficialLinks();
    res.json({
      success: true,
      data: links
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Returns a specific tutorial content summary.
 * GET /api/docs/tutorial/:topic
 */
export async function getTutorial(req, res, next) {
  try {
    const { topic } = req.params;
    if (!topic) {
      return res.status(400).json({ 
        success: false, 
        error: { message: 'Topic parameter is required.' } 
      });
    }

    const tutorial = await getTutorialByTopic(topic);
    res.json({
      success: true,
      data: tutorial
    });
  } catch (error) {
    next(error);
  }
}
