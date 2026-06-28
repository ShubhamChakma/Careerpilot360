import { auth } from '../config/firebase.js';
import env from '../config/env.js';

export default async function firebaseAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        error: { message: 'Unauthorized. Missing or invalid Authorization header.' } 
      });
    }

    const token = authHeader.split('Bearer ')[1];

    // Local development bypass support
    if (env.NODE_ENV === 'development' && (token === 'dev-token' || token.startsWith('dev-user-'))) {
      const uid = token === 'dev-token' ? 'dev-user-123' : token.substring(9);
      req.user = {
        uid,
        email: `${uid}@careerpilot360.com`,
        name: 'Developer User',
        role: 'developer'
      };
      return next();
    }

    const decodedToken = await auth.verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || decodedToken.email.split('@')[0]
    };
    next();
  } catch (error) {
    console.error('🛡️ Auth Middleware Error:', error.message);
    return res.status(401).json({ 
      success: false, 
      error: { message: 'Unauthorized. Invalid or expired token.' } 
    });
  }
}
