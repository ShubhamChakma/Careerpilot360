/**
 * uploadQuestions.js
 * Uploads questions and test cases to Firestore exactly as they appear in questions_updated.json.
 */

const https = require("https");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const questions = require("./questions_updated.json");

// Service Account auto-detection
const possibleKeys = [
    path.resolve(__dirname, "./firebase-service-account.json"),
    path.resolve(__dirname, "../careerpilot-9cac6-firebase-adminsdk-fbsvc-e6d708f22a.json"),
    path.resolve(process.cwd(), "./careerpilot-9cac6-firebase-adminsdk-fbsvc-e6d708f22a.json")
];

let serviceAccount = null;
for (const kPath of possibleKeys) {
    if (fs.existsSync(kPath)) {
        serviceAccount = JSON.parse(fs.readFileSync(kPath, "utf8"));
        console.log(`🔑 Service account loaded from: ${path.basename(kPath)}`);
        break;
    }
}

if (!serviceAccount) {
    console.error("❌ Firebase service account JSON file not found!");
    process.exit(1);
}

const PROJECT_ID = serviceAccount.project_id;
const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// ── JWT / Auth ────────────────────────────────────────────────────────────────

function base64url(buf) {
    return Buffer.from(buf)
        .toString("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
}

async function getAccessToken() {
    const now = Math.floor(Date.now() / 1000);
    const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
    const payload = base64url(
        JSON.stringify({
            iss: serviceAccount.client_email,
            sub: serviceAccount.client_email,
            aud: "https://oauth2.googleapis.com/token",
            iat: now,
            exp: now + 3600,
            scope:
                "https://www.googleapis.com/auth/datastore https://www.googleapis.com/auth/cloud-platform",
        })
    );
    const signingInput = `${header}.${payload}`;
    const sign = crypto.createSign("RSA-SHA256");
    sign.update(signingInput);
    sign.end();
    const signature = base64url(sign.sign(serviceAccount.private_key));
    const jwt = `${signingInput}.${signature}`;

    return new Promise((resolve, reject) => {
        const body = `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`;
        const req = https.request(
            {
                hostname: "oauth2.googleapis.com",
                path: "/token",
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Content-Length": Buffer.byteLength(body),
                },
            },
            (res) => {
                let data = "";
                res.on("data", (c) => (data += c));
                res.on("end", () => {
                    const json = JSON.parse(data);
                    if (json.access_token) resolve(json.access_token);
                    else reject(new Error(JSON.stringify(json)));
                });
            }
        );
        req.on("error", reject);
        req.write(body);
        req.end();
    });
}

// ── Firestore REST ────────────────────────────────────────────────────────────

function httpsRequest(method, url, token, body) {
    return new Promise((resolve, reject) => {
        const parsed = new URL(url);
        const bodyStr = body ? JSON.stringify(body) : null;
        const req = https.request(
            {
                hostname: parsed.hostname,
                path: parsed.pathname + parsed.search,
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    ...(bodyStr ? { "Content-Length": Buffer.byteLength(bodyStr) } : {}),
                },
            },
            (res) => {
                let data = "";
                res.on("data", (c) => (data += c));
                res.on("end", () => {
                    try {
                        resolve({ status: res.statusCode, body: JSON.parse(data) });
                    } catch {
                        resolve({ status: res.statusCode, body: data });
                    }
                });
            }
        );
        req.on("error", reject);
        if (bodyStr) req.write(bodyStr);
        req.end();
    });
}

function toFSValue(val, insideArray = false) {
    if (val === null || val === undefined) return { nullValue: null };
    if (typeof val === "boolean") return { booleanValue: val };
    if (typeof val === "number") {
        return Number.isInteger(val)
            ? { integerValue: String(val) }
            : { doubleValue: val };
    }
    if (typeof val === "string") return { stringValue: val };
    if (Array.isArray(val)) {
        if (insideArray) {
            return { stringValue: JSON.stringify(val) };
        }
        return {
            arrayValue: { values: val.map((item) => toFSValue(item, true)) },
        };
    }
    if (typeof val === "object") {
        const fields = {};
        for (const [k, v] of Object.entries(val)) {
            fields[k] = toFSValue(v, false);
        }
        return { mapValue: { fields } };
    }
    return { stringValue: String(val) };
}

function toFSDoc(obj) {
    const fields = {};
    for (const [k, v] of Object.entries(obj)) {
        fields[k] = toFSValue(v);
    }
    return { fields };
}

async function setDoc(token, collection, docId, data) {
    const url = `${FIRESTORE_BASE}/${collection}/${docId}`;
    const res = await httpsRequest("PATCH", url, token, toFSDoc(data));
    if (res.status !== 200) {
        throw new Error(
            `HTTP ${res.status}: ${JSON.stringify(res.body?.error || res.body)}`
        );
    }
    return res.body;
}

// ── Slug ──────────────────────────────────────────────────────────────────────

function slugify(str) {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
}

// ── Build test-case payload ───────────────────────────────────────────────────

function buildTestCaseMap(tc) {
    const fields = {
        input:  { stringValue: tc.input  },
        output: { stringValue: tc.output },
    };
    if (tc.structuredInput !== undefined) {
        fields.structuredInput = toFSValue(tc.structuredInput);
    }
    if (tc.explanation !== undefined) {
        fields.explanation = { stringValue: tc.explanation };
    }
    return { mapValue: { fields } };
}

function buildTestCasesDoc(q) {
    return {
        fields: {
            sampleTestCases: {
                arrayValue: {
                    values: (q.sampleTestCases || []).map(buildTestCaseMap),
                },
            },
            hiddenTestCases: {
                arrayValue: {
                    values: (q.hiddenTestCases || []).map(buildTestCaseMap),
                },
            },
        },
    };
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function uploadQuestions() {
    const FORCE = process.argv.includes("--force");

    console.log(`🔥 Project  : ${PROJECT_ID}`);
    console.log(`📦 Questions: ${questions.length}`);
    console.log(
        `🔄 Mode     : ${FORCE ? "FORCE UPDATE (overwrite all)" : "SAFE (skip existing)"}\n`
    );

    console.log("🔑 Getting access token...");
    const token = await getAccessToken();
    console.log("✅ Authenticated!\n");

    let uploaded = 0,
        failed = 0;

    for (const q of questions) {
        const slug = slugify(q.name);

        try {
            // ── problems collection ──────────────────────────────────────────────
            await setDoc(token, "problems", slug, {
                title: q.name,
                topic: q.topic || "Arrays",
                difficulty: q.difficulty.toLowerCase(),
                rating: q.rating,
                description: q.description,
                constraints: q.constraints || {},
                inputFormat: q.inputFormat || [],
                outputFormat: q.outputFormat || [],
            });

            // ── problem_testcases collection ──────────────────────────────────────
            const tcUrl = `${FIRESTORE_BASE}/problem_testcases/${slug}`;
            const tcDoc = buildTestCasesDoc(q);
            const tcRes = await httpsRequest("PATCH", tcUrl, token, tcDoc);
            if (tcRes.status !== 200) {
                throw new Error(
                    `test-cases HTTP ${tcRes.status}: ${JSON.stringify(
                        tcRes.body?.error || tcRes.body
                    )}`
                );
            }

            console.log(`✅ Uploaded  "${q.name}" → ${slug}`);
            uploaded++;
        } catch (err) {
            console.error(`❌ Failed    "${q.name}": ${err.message}`);
            failed++;
        }
    }

    console.log("\n─────────────────────────────────");
    console.log(`✅ Uploaded : ${uploaded}`);
    console.log(`❌ Failed   : ${failed}`);
    console.log("─────────────────────────────────");
    process.exit(failed > 0 ? 1 : 0);
}

uploadQuestions().catch((err) => {
    console.error("\n💥 Fatal:", err.message);
    process.exit(1);
});
