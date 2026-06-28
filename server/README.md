# Careerpilot360 - Backend API Server

This is the backend API server for **Careerpilot360**, built with **Node.js**, **Express**, **Firebase Admin SDK**, **Redis**, and **Groq AI**. 

It handles AI chats (PrepBot), ATS resume analysis, mock interviews (Interview Studio), job match predictions, and coding assessment sandbox executions (OA Arena).

---

## 🚀 Key Features & Architecture

- **Zero-Config Developer Fallback**: The server is designed to boot out-of-the-box. If Firebase, Redis, or Groq parameters are missing from your `.env`, it fallback to **in-memory mocks** (Mock Firestore, Mock Auth dev bypass, and local JS sandbox compiler).
- **Asynchronous Compiler Queue**: Integrates a lightweight FIFO job queue that offloads code evaluation tasks to background worker processes, preventing thread blocks.
- **Developer Auth Bypass**: In development mode (`NODE_ENV=development`), you can bypass Firebase ID tokens by passing `Authorization: Bearer dev-user-<uid>`.

---

## 🛠️ Getting Started

### 📋 Prerequisites
- **Node.js** (v18 or higher recommended)
- **NPM** (packaged with Node.js)
- **Docker & Docker Compose** (Optional: for running clustered containers)

### 📦 Local Installation

1. Navigate to the server folder:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your environment file from the template:
   ```bash
   cp .env.example .env
   ```
   *(Review and modify the `.env` file to customize settings or inject real keys)*

4. Start the server in development mode:
   ```bash
   npm run dev
   ```
   The backend will listen on **http://localhost:5000**.

---

## 🐳 Running with Docker

You can spin up both the backend API server and a dedicated Redis database container from the workspace root using Docker Compose:

```bash
# In the workspace root folder:
docker-compose up --build
```

---

## ⚙️ Environment Configuration (`.env`)

Review the variables available for injection:

| Variable | Description | Required | Default |
| :--- | :--- | :--- | :--- |
| `PORT` | Local express listener port | No | `5000` |
| `NODE_ENV` | Environment context (`development`, `production`) | No | `development` |
| `REDIS_URL` | Redis connection URL | No | `redis://localhost:6379` |
| `GROQ_API_KEY` | Groq Developer API Key (for LLM operations) | No (Runs in mock mode if missing) | `undefined` |
| `FIREBASE_PROJECT_ID` | Firebase target project ID | No (Runs in mock Firestore if missing) | `undefined` |
| `FIREBASE_CLIENT_EMAIL`| Firebase service account client email | No | `undefined` |
| `FIREBASE_PRIVATE_KEY` | Firebase service account RSA key | No | `undefined` |

---

## 🔗 Primary API Routes Reference

All endpoints are prefixed with `/api`. Authentication headers must be provided as `Authorization: Bearer <token>`.

### 🛡️ Core Services
- **`GET /api/health`**: Server connectivity sanity check.
- **`GET /api/health/test`**: Runs integration self-test checking compiler and AI modules.

### 🤖 PrepBot (AI Chat)
- **`POST /api/ai/chat`**: Solicits conversational chat responses.
- **`GET /api/chat-sessions`**: Retrieves the logged-in user's study sessions.
- **`POST /api/chat-sessions`**: Establishes a new session record.

### 📄 ATS Resume Scanner
- **`POST /api/resume/scan`**: Accepts `multipart/form-data` with `resume` file field and `jobDescription` text parameter. Returns ATS match scorecards.

### 🎙️ Interview Studio
- **`POST /api/interview/start`**: Begins mock interview sessions.
- **`POST /api/interview/submit-answer`**: Grates candidate text answers and responds with feedback + next question.

### 💻 OA Arena (Code Sandbox)
- **`POST /api/compile`**: Accepts code, language (javascript, python), and testcase specs. Returns `jobId` from the queue.
- **`GET /api/compile/:jobId`**: Polls compilation execution progress and outputs details.
