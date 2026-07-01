/**
 * Shared Firebase Admin singleton for the Compiler Server.
 * Import this module anywhere you need `db` — it guarantees Admin
 * is initialised exactly once regardless of require() order.
 */
require("dotenv").config();

const { initializeApp, getApps, cert } = require("firebase-admin/app");
const { getFirestore }                  = require("firebase-admin/firestore");
const path = require("path");
const fs   = require("fs");

if (!getApps().length) {
    let sa;

    // 1️⃣  Full JSON blob env var (set FIREBASE_SERVICE_ACCOUNT_JSON on Render)
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
        try {
            sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
            console.log("[Firebase] Loaded credentials from FIREBASE_SERVICE_ACCOUNT_JSON env var");
        } catch (err) {
            console.error("[Firebase] Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:", err.message);
            process.exit(1);
        }

    // 2️⃣  Individual env vars — easiest option for Render / Vercel / Railway
    } else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
        sa = {
            type: "service_account",
            project_id:   process.env.FIREBASE_PROJECT_ID,
            client_email: process.env.FIREBASE_CLIENT_EMAIL,
            // Render stores \n literally — convert back to real newlines
            private_key:  process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        };
        console.log(`[Firebase] Loaded credentials from individual env vars (project: ${sa.project_id})`);

    // 3️⃣  Local JSON file fallback (development only)
    } else {
        const saPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH
            || "../careerpilot-9cac6-firebase-adminsdk-fbsvc-e6d708f22a.json";
        const resolved = path.resolve(process.cwd(), saPath);

        if (!fs.existsSync(resolved)) {
            console.error(`[Firebase] service account not found at ${resolved}`);
            console.error("[Firebase] On Render/production, set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY env vars.");
            process.exit(1);
        }

        try {
            sa = JSON.parse(fs.readFileSync(resolved, "utf8"));
            console.log(`[Firebase] Loaded credentials from file: ${resolved}`);
        } catch (err) {
            console.error("[Firebase] Failed to read service account file:", err.message);
            process.exit(1);
        }
    }

    try {
        initializeApp({ credential: cert(sa), projectId: sa.project_id });
        console.log(`🔥 Firebase Admin initialized for: ${sa.project_id}`);
    } catch (err) {
        console.error("❌ Firebase Admin init failed:", err.message);
        process.exit(1);
    }
}

const { getAuth } = require("firebase-admin/auth");

const db = getFirestore();
db.settings({ databaseId: "(default)" });
const auth = getAuth();

module.exports = { db, auth };
