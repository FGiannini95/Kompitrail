require("dotenv").config();
const OpenAI = require("openai");

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Helper to map short language codes to full language names for the system prompt
function mapLanguageCode(lang) {
  switch (lang) {
    case "es":
      return "Spanish";
    case "it":
      return "Italian";
    case "en":
      return "English";
    default:
      return "Spanish";
  }
}

// Builds the prompt, sends it to OpenAI and returns the assistant reply text
async function askChatbot({ message, language, history }) {
  const languageName = mapLanguageCode(language);

  // Base system instructions for the assistant
  const systemContent = `
    You are the help assistant of a mobile app about motorbike routes and trips.
    The user interface language is: ${languageName}.
    Always answer only in this language.

    The main features of the app are:
    - A user can create, edit and delete their own motorbikes.
    - A user can create, edit and delete routes.
    - A user can join (participate in) a route and cancel their participation.
    - Joining and cancelling participation are only allowed until 60 minutes before the route start time.
    - When a route is created, a chat (via socket) is automatically created where participants can talk in real time.

    Your main goals:
    - Explain how the app works (routes, motorbikes, account, settings, registrations and chat).
    - Be brief, clear and practical.
    - If you are not sure about something, say that you are not sure instead of inventing.
    - If the user asks for something unrelated to the app, you can answer briefly.
    - If the user asks for something illegal, dangerous or against the app rules, politely refuse.

    Conversation behavior:
    - If the conversation seems idle or the user indicates that the problem is solved, briefly ask if they need anything else.
    - If the user confirms that everything is solved or says goodbye, you may offer to close with a short, light and clean joke.
    - Only tell the joke if the user accepts or seems open to it; do not force it in every answer.
  `;

  // Build the message array with the system + user message
  const messages = [
    { role: "system", content: systemContent },
    { role: "user", content: message },
  ];

  // Call API
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    max_tokens: 250, // Limit answer length to control cost
    temperature: 0.4, // Lower temperature for more consistent answers
  });

  // Extract the assistant reply text safely
  const assistantMessage = response.choices?.[0]?.message?.content || "";
  return assistantMessage;
}

module.exports = { askChatbot };
