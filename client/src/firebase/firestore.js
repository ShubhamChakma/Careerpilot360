import { db } from './config';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

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