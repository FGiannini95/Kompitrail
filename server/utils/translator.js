require("dotenv").config();
const deepl = require("deepl-node");

const translator = new deepl.Translator(process.env.DEEPL_API_KEY);

async function translateText(text, sourceLang, targetLang) {
  if (!text) return;

  // DeepL requires uppercase language codes: ES, EN, IT
  const source = sourceLang.toUpperCase();
  const target = targetLang.toUpperCase();

  const result = await translator.translateText(text, source, target);

  return result.text;
}

module.export = translateText;
