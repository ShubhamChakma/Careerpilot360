import express from 'express';
import cors from 'cors';
import env from './config/env.js';
import errorHandler from './middleware/errorHandler.js';
import { startCompilerWorker } from './workers/compile.worker.js';
import { runSanityCheck } from './utils/testRunner.js';

// Import Route handlers
import aiRoutes from './routes/ai.routes.js';
import chatSessionRoutes from './routes/chat-sessions.routes.js';
import compileRoutes from './routes/compile.routes.js';
import docsRoutes from './routes/docs.routes.js';
import interviewRoutes from './routes/interview.routes.js';
import jobPredictRoutes from './routes/jobPredict.routes.js';
import resumeRoutes from './routes/resume.routes.js';


const app = express();


// ===============================
// CORS CONFIGURATION
// ===============================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  env.CLIENT_URL
].filter(Boolean);


app.use(
  cors({

    origin: (origin, callback) => {

      // allow server-to-server requests / Postman
      if (!origin) {
        return callback(null, true);
      }


      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }


      return callback(
        new Error("Blocked by CORS policy")
      );

    },

    credentials: true

  })
);



// ===============================
// Standard middlewares
// ===============================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true
  })
);



// ===============================
// Health endpoints
// ===============================

app.get('/api/health', (req, res) => {

  res.json({

    success: true,

    message:
      'Careerpilot360 backend service is online.',

    timestamp:
      new Date().toISOString(),

    environment:
      env.NODE_ENV

  });

});



app.get('/api/health/test', async (req, res) => {

  const result = await runSanityCheck();


  res
    .status(result.success ? 200 : 500)
    .json({

      success: result.success,

      data: result

    });

});



// ===============================
// API Routes
// ===============================

app.use('/api/ai', aiRoutes);

app.use(
  '/api/chat-sessions',
  chatSessionRoutes
);

app.use('/api/compile', compileRoutes);

app.use('/api/docs', docsRoutes);

app.use('/api/interview', interviewRoutes);

app.use('/api/job-predict', jobPredictRoutes);

app.use('/api/resume', resumeRoutes);



// ===============================
// 404 Handler
// ===============================

app.use((req, res) => {

  res.status(404).json({

    success:false,

    error:{

      message:
        `Resource not found: ${req.method} ${req.originalUrl}`,

      statusCode:404

    }

  });

});



// ===============================
// Error Handler
// ===============================

app.use(errorHandler);



// ===============================
// Background workers
// ===============================

startCompilerWorker();



// ===============================
// Start Server
// ===============================

app.listen(env.PORT, () => {

  console.log(
    `🚀 Careerpilot360 Server listening on port ${env.PORT} in ${env.NODE_ENV} mode.`
  );

});


export default app;