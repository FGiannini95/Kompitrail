require("dotenv").config();
const deepl = require("deepl-node");

let translator = null;

const TARGET_LANG_MAP = {
  es: "ES",
  it: "IT",
  en: "EN-GB",
};

// Returns a DeepL translator instance if configured.
function getTranslator() {
  const key = process.env.DEEPL_API_KEY;
  if (!key) return null;
  if (!translator) translator = new deepl.Translator(key);
  return translator;
}

async function translateText(text, sourceLang, targetLang) {
  if (!text) return;

  const instance = getTranslator();
  if (!instance) {
    return text;
  }

  const target = TARGET_LANG_MAP[targetLang.toLowerCase()] || "ES";

  let result;
  if (sourceLang) {
    // DeepL requires uppercase language codes: ES, EN, IT
    const source = sourceLang.toUpperCase();
    result = await translator.translateText(text, source, target);
  } else {
    // For auto-detection, don't pass source language
    result = await translator.translateText(text, null, target);
  }

  return result.text;
}

module.exports = translateText;
