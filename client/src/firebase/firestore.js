import { db } from './config';
import { doc, setDoc, getDoc, serverTimestamp, collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';

/**
 * Subscribe to a user's submissions in real time.
 * Returns an unsubscribe function — call it when the component unmounts.
 * Callback receives sorted submissions (newest first).
 */
export const subscribeToSubmissions = (userId, callback) => {
  if (!db) {
    callback([]);
    return () => {};
  }
  // No composite index needed — just filter by userId, sort client-side
  const q = query(
    collection(db, 'submissions'),
    where('userId', '==', userId)
  );
  const unsub = onSnapshot(
    q,
    (snap) => {
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      // Sort newest first client-side (avoids needing a Firestore composite index)
      docs.sort((a, b) => {
        const ta = a.submittedAt?.toDate?.() ?? new Date(0);
        const tb = b.submittedAt?.toDate?.() ?? new Date(0);
        return tb - ta;
      });
      callback(docs);
    },
    (err) => {
      console.warn('[Firestore] subscribeToSubmissions error:', err.message);
      callback([]);
    }
  );
  return unsub;
};

export const saveJobPrediction = async (userId, data) => {
  try {
    if (!db) return;
    await setDoc(doc(db, 'job_predictions', userId), { ...data, cachedAt: serverTimestamp() });
  } catch (err) {
    console.warn('[Firestore] saveJobPrediction failed (permissions or offline mode):', err.message);
  }
};

export const getJobPrediction = async (userId) => {
  try {
    if (!db) return null;
    const snap = await getDoc(doc(db, 'job_predictions', userId));
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.warn('[Firestore] getJobPrediction failed (permissions or offline mode):', err.message);
    return null;
  }
};

export const getResume = async (userId) => {
  try {
    if (!db) return null;
    const snap = await getDoc(doc(db, 'resumes', userId));
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.warn('[Firestore] getResume failed (permissions or offline mode):', err.message);
    return null;
  }
};

export const saveChatSession = async (sessionId, data) => {
  try {
    if (!db) return;
    await setDoc(doc(db, 'chat_sessions', sessionId), {
      ...data,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    console.warn('[Firestore] saveChatSession failed (permissions or offline mode):', err.message);
  }
};

export const getChatSession = async (sessionId) => {
  try {
    if (!db) return null;
    const snap = await getDoc(doc(db, 'chat_sessions', sessionId));
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.warn('[Firestore] getChatSession failed (permissions or offline mode):', err.message);
    return null;
  }
};