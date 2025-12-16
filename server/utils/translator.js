require("dotenv").config();
const deepl = require("deepl-node");

const translator = new deepl.Translator(process.env.DEEPL_API_KEY);

const TARGET_LANG_MAP = {
  es: "ES",
  it: "IT",
  en: "EN-GB",
};

async function translateText(text, sourceLang, targetLang) {
  if (!text) return;

  // DeepL requires uppercase language codes: ES, EN, IT
  const source = sourceLang.toUpperCase();
  const target = TARGET_LANG_MAP[targetLang.toLowerCase()] || "ES";

  const result = await translator.translateText(text, source, target);

  return result.text;
}

module.exports = translateText;
