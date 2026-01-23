// scripts/translate.cjs
// Translate ALL namespaces inside locales/es/*.json into EN and IT using DeepL.
// It only fills missing/empty translations in EN/IT, without overwriting existing ones.

const process = require("process");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config(); // Load .env variables

const DEEPL_URL = "https://api-free.deepl.com/v2/translate";
const API_KEY = process.env.VITE_DEEPL_API_KEY;

if (!API_KEY) {
  console.error("❌ ERROR: Missing VITE_DEEPL_API_KEY in .env");
  process.exit(1);
}

// Call DeepL to translate an array of texts from ES to targetLang (EN / IT)
// Call DeepL to translate an array of texts from ES to targetLang (EN / IT)
async function translateTexts(texts, targetLang) {
  if (texts.length === 0) return [];

  const response = await fetch(DEEPL_URL, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: texts,
      source_lang: "ES",
      target_lang: targetLang,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DeepL error ${response.status}: ${errorText}`);
  }

  const json = await response.json();
  return json.translations.map((t) => t.text);
}

// Read JSON file, return {} if missing
function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

// Write JSON file
function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

// Flatten nested object into key paths + texts
// esData = { title: "...", actions: { changePassword: "..." } }
// => keys = ["title", "actions.changePassword", ...]
// => texts = ["Ajustes", "Modificar contraseña", ...]
function flattenTranslations(obj, parentKey = "") {
  const keys = [];
  const texts = [];

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = parentKey ? `${parentKey}.${key}` : key;

    if (typeof value === "string") {
      keys.push(fullKey);
      texts.push(value);
    } else if (value && typeof value === "object") {
      const { keys: childKeys, texts: childTexts } = flattenTranslations(
        value,
        fullKey
      );
      keys.push(...childKeys);
      texts.push(...childTexts);
    } else {
      // Ignore non-string values
    }
  }

  return { keys, texts };
}

// Get nested property given a path like "actions.changePassword"
function getNested(obj, path) {
  const parts = path.split(".");
  let current = obj;

  for (const part of parts) {
    if (!current || typeof current !== "object") return undefined;
    current = current[part];
  }
  return current;
}

// Set nested property given a path like "actions.changePassword"
function setNested(obj, path, value) {
  const parts = path.split(".");
  let current = obj;

  parts.forEach((part, idx) => {
    if (idx === parts.length - 1) {
      current[part] = value;
    } else {
      if (!current[part] || typeof current[part] !== "object") {
        current[part] = {};
      }
      current = current[part];
    }
  });
}

// Translate one namespace: settings.json, general.json, etc.
async function translateNamespace(namespace) {
  const base = "src/i18n/locales";

  const esFile = path.join(base, "es", `${namespace}.json`);
  const enFile = path.join(base, "en", `${namespace}.json`);
  const itFile = path.join(base, "it", `${namespace}.json`);

  console.log(`\n🔍 Translating namespace: ${namespace}`);

  const esData = JSON.parse(fs.readFileSync(esFile, "utf8"));

  // Flatten ES source
  const { keys, texts } = flattenTranslations(esData);
  if (texts.length === 0) {
    console.log("  (no translatable strings, skipping)");
    return;
  }

  // Read existing EN / IT (if any)
  const existingEn = readJsonIfExists(enFile);
  const existingIt = readJsonIfExists(itFile);

  // Clone existing so we preserve anything already there
  const enResult = JSON.parse(JSON.stringify(existingEn || {}));
  const itResult = JSON.parse(JSON.stringify(existingIt || {}));

  // Decide which keys need EN translation
  const enKeysToTranslate = [];
  const enTextsToTranslate = [];

  keys.forEach((keyPath, idx) => {
    const current = getNested(existingEn, keyPath);

    if (typeof current === "string" && current.trim() !== "") {
      // Keep existing translation
      return;
    }

    // Needs translation
    enKeysToTranslate.push(keyPath);
    enTextsToTranslate.push(texts[idx]);
  });

  // Decide which keys need IT translation
  const itKeysToTranslate = [];
  const itTextsToTranslate = [];

  keys.forEach((keyPath, idx) => {
    const current = getNested(existingIt, keyPath);

    if (typeof current === "string" && current.trim() !== "") {
      return;
    }

    itKeysToTranslate.push(keyPath);
    itTextsToTranslate.push(texts[idx]);
  });

  console.log(`  EN: ${enKeysToTranslate.length} keys to translate`);
  console.log(`  IT: ${itKeysToTranslate.length} keys to translate`);

  // Translate only missing EN keys
  if (enKeysToTranslate.length > 0) {
    const enTranslations = await translateTexts(enTextsToTranslate, "EN");
    enKeysToTranslate.forEach((keyPath, idx) => {
      setNested(enResult, keyPath, enTranslations[idx]);
    });
  }

  // Translate only missing IT keys
  if (itKeysToTranslate.length > 0) {
    const itTranslations = await translateTexts(itTextsToTranslate, "IT");
    itKeysToTranslate.forEach((keyPath, idx) => {
      setNested(itResult, keyPath, itTranslations[idx]);
    });
  }

  // Write back merged results (existing + new translations)
  writeJson(enFile, enResult);
  writeJson(itFile, itResult);

  console.log(`  ✔ Done: ${namespace}`);
}

async function main() {
  const esPath = "src/i18n/locales/es";

  console.log("🔎 Searching namespaces in:", esPath);

  const files = fs
    .readdirSync(esPath)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""));

  console.log("Namespaces found:", files);

  for (const ns of files) {
    await translateNamespace(ns);
  }

  console.log("\n🎉 All namespaces translated (non-destructive)!");
}

// Run script
main().catch((err) => {
  console.error("❌ Translation failed:", err);
  process.exit(1);
});
