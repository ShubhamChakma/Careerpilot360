import { db } from '../config/firebase.js';

/**
 * Creates a new chat session.
 * POST /api/chat-sessions
 */
export async function createSession(req, res, next) {
  try {
    const userId = req.user.uid;
    const { title } = req.body;

    const sessionData = {
      userId,
      title: title || 'Untitled Study Session',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await db.collection('chat_sessions').add(sessionData);
    
    res.status(201).json({
      success: true,
      data: {
        id: docRef.id,
        ...sessionData
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Returns all chat sessions for the authenticated user.
 * GET /api/chat-sessions
 */
export async function getSessions(req, res, next) {
  try {
    const userId = req.user.uid;
    
    const snapshot = await db.collection('chat_sessions')
      .where('userId', '==', userId)
      .get();

    const sessions = [];
    snapshot.docs.forEach(doc => {
      sessions.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Sort by most recently updated
    sessions.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    res.json({
      success: true,
      data: sessions
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Returns a single chat session by ID.
 * GET /api/chat-sessions/:id
 */
export async function getSessionById(req, res, next) {
  try {
    const userId = req.user.uid;
    const { id } = req.params;

    const doc = await db.collection('chat_sessions').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ 
        success: false, 
        error: { message: 'Chat session not found.' } 
      });
    }

    const data = doc.data();
    if (data.userId !== userId) {
      return res.status(403).json({ 
        success: false, 
        error: { message: 'Forbidden access to chat session.' } 
      });
    }

    res.json({
      success: true,
      data: {
        id: doc.id,
        ...data
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Updates a chat session (messages list or title).
 * PUT /api/chat-sessions/:id
 */
export async function updateSession(req, res, next) {
  try {
    const userId = req.user.uid;
    const { id } = req.params;
    const { messages, title } = req.body;

    const docRef = db.collection('chat_sessions').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ 
        success: false, 
        error: { message: 'Chat session not found.' } 
      });
    }

    const data = doc.data();
    if (data.userId !== userId) {
      return res.status(403).json({ 
        success: false, 
        error: { message: 'Forbidden access to chat session.' } 
      });
    }

    const updates = {
      updatedAt: new Date().toISOString()
    };
    if (messages !== undefined) updates.messages = messages;
    if (title !== undefined) updates.title = title;

    await docRef.update(updates);

    res.json({
      success: true,
      data: {
        id,
        ...data,
        ...updates
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Deletes a chat session.
 * DELETE /api/chat-sessions/:id
 */
export async function deleteSession(req, res, next) {
  try {
    const userId = req.user.uid;
    const { id } = req.params;

    const docRef = db.collection('chat_sessions').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ 
        success: false, 
        error: { message: 'Chat session not found.' } 
      });
    }

    const data = doc.data();
    if (data.userId !== userId) {
      return res.status(403).json({ 
        success: false, 
        error: { message: 'Forbidden access to chat session.' } 
      });
    }

    await docRef.delete();

    res.json({
      success: true,
      message: 'Chat session deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
}
