import dotenv from 'dotenv';

// Load environmental variables
dotenv.config();

const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  FIREBASE: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/^"(.*)"$/, '$1').replace(/\\n/g, '\n') : undefined,
  },
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  COMPILER_SERVER_URL: process.env.COMPILER_SERVER_URL || 'http://localhost:3000',
  SMTP: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  FEEDBACK_RECIPIENT: process.env.FEEDBACK_RECIPIENT || 'shubhamchakma150905@gmail.com',
};

const isDev = env.NODE_ENV === 'development';

// Inform developer about running modes
if (!env.GROQ_API_KEY) {
  if (isDev) {
    console.warn('⚠️ WARNING: GROQ_API_KEY is not defined. AI features (PrepBot, ATS Scanner, Interview Studio) will run in MOCK mode.');
  } else {
    console.error('❌ ERROR: GROQ_API_KEY is required in production.');
  }
}

if (!env.FIREBASE.projectId || !env.FIREBASE.clientEmail || !env.FIREBASE.privateKey) {
  if (isDev) {
    console.warn('⚠️ WARNING: Firebase credentials are incomplete. Database and Auth will run in local MOCK/BYPASS mode.');
  } else {
    console.error('❌ ERROR: Firebase credentials are required in production.');
  }
}

if (!env.SMTP.user || !env.SMTP.pass) {
  console.warn('⚠️ WARNING: SMTP credentials (SMTP_USER/SMTP_PASS) are not defined. Feedback emails will be SIMULATED (logged to console).');
}

export default env;
