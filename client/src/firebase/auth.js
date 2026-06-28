import { auth } from './config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

import { useAuthStore } from '../store/authStore';

export const registerWithEmail = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

export const loginWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const loginWithGoogle = () =>
  signInWithPopup(auth, new GoogleAuthProvider());

export const logout = () => signOut(auth);

export const getCurrentUserToken = () => {
  if (auth?.currentUser) {
    return auth.currentUser.getIdToken();
  }
  // Return dev-token fallback for Demo Login or local development
  if (useAuthStore.getState().user) {
    return 'dev-token';
  }
  return null;
};