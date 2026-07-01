import { db } from '../config/firebase.js';

/**
 * GET /api/submissions
 * Returns all submissions for the authenticated user, newest first.
 */
export async function getUserSubmissions(req, res) {
  console.log(`📋 [Submissions Controller] Fetching submissions for UID: ${req.user?.uid}`);
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
    }

    const snap = await db
      .collection('submissions')
      .where('userId', '==', userId)
      .get();

    const submissions = snap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        problemId:   data.problemId   ?? null,
        verdict:     data.verdict     ?? null,
        passed:      data.passed      ?? null,
        total:       data.total       ?? null,
        language:    data.language    ?? null,
        submittedAt: data.submittedAt
          ? data.submittedAt.toDate().toISOString()   // convert Firestore Timestamp → ISO string
          : null,
      };
    });

    // Sort newest first (client-safe, no composite index needed)
    submissions.sort((a, b) => {
      const ta = a.submittedAt ? new Date(a.submittedAt) : new Date(0);
      const tb = b.submittedAt ? new Date(b.submittedAt) : new Date(0);
      return tb - ta;
    });

    return res.json({ success: true, submissions });
  } catch (err) {
    console.error('[submissions] Failed to fetch submissions:', err.message);
    return res.status(500).json({ success: false, error: { message: err.message } });
  }
}
