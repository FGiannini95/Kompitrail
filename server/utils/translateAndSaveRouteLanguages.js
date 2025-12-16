// This function transforms the original language written by the user into all supported languages (es, en, it).

const queryAsync = require("./queryAsync");
const translateText = require("./translator");

const SUPPORTED_LANGUAGES = ["es", "en", "it"];

async function translateAndSaveRouteLanguages(connection, routeId, sourceLang) {
  // Validate the source language
  if (!SUPPORTED_LANGUAGES.includes(sourceLang)) {
    throw new Error(`Unsupported sourceLang: ${sourceLang}`);
  }

  // Determine the target language
  const targetLangs = SUPPORTED_LANGUAGES.filter((lang) => lang !== sourceLang);

  // Read the source text from DB
  const selectSourceSql = `
    SELECT starting_point, ending_point, route_description
    FROM route_translation
    WHERE route_id = ? and lang = ?
    LIMIT 1
  `;

  const sourceRows = await queryAsync(connection, selectSourceSql, [
    routeId,
    sourceLang,
  ]);

  if (!sourceRows || sourceRows.length === 0) {
    throw new Error(
      `No source translation found for route_id=${routeId} and lang=${sourceLang}`
    );
  }

  const source = sourceRows[0];
  const {
    starting_point: sourceStartingPoint,
    ending_point: sourceEndingPoint,
    route_description: sourceDescription,
  } = source;

  // Translate and save each target language
  const updateSql = `
    INSERT INTO route_translation (
      route_id, lang, starting_point, ending_point, route_description
    )
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      starting_point = VALUES(starting_point),
      ending_point = VALUES(ending_point),
      route_description = VALUES(route_description)
  `;

  const tasks = targetLangs.map(async (targetLang) => {
    const translatedStartingPoint = await translateText(
      sourceStartingPoint,
      sourceLang,
      targetLang
    );

    const translatedEndingPoint = await translateText(
      sourceEndingPoint,
      sourceLang,
      targetLang
    );

    const translatedDescription = sourceDescription
      ? await translateText(sourceDescription, sourceLang, targetLang)
      : null;

    await queryAsync(connection, updateSql, [
      routeId,
      targetLang,
      translatedStartingPoint,
      translatedEndingPoint,
      translatedDescription,
    ]);
  });

  await Promise.all(tasks);
}

module.exports = translateAndSaveRouteLanguages;
