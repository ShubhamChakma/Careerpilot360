import { db } from './config';
import { doc, setDoc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const saveJobPrediction = async (userId, data) => {
  await setDoc(doc(db, 'job_predictions', userId), { ...data, cachedAt: serverTimestamp() });
};

export const getJobPrediction = async (userId) => {
  const snap = await getDoc(doc(db, 'job_predictions', userId));
  return snap.exists() ? snap.data() : null;
};

export const getResume = async (userId) => {
  const snap = await getDoc(doc(db, 'resumes', userId));
  return snap.exists() ? snap.data() : null;
};

export const saveChatSession = async (sessionId, data) => {
  await setDoc(doc(db, 'chat_sessions', sessionId), {
    ...data,
    updatedAt: serverTimestamp()
  }, { merge: true });
};

export const getChatSession = async (sessionId) => {
  const snap = await getDoc(doc(db, 'chat_sessions', sessionId));
  return snap.exists() ? snap.data() : null;
};