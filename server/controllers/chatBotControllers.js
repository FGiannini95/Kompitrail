const { askChatbot } = require("../utils/openaiService");
require("dotenv").config();

class chatBotControllers {
  // Process user message and return chatbot reply
  handleChatRequest = async (req, res) => {
    console.log("hi from handleChatRequest");
    const lang = req.query.lang || "es";
    const { message, history = [] } = req.body;

    // Validate that message exists
    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message is required" });
    }

    try {
      // Call service that communicates with OpenAI
      const reply = await askChatbot({ message, language: lang, history });
      return res.status(200).json({ reply, language: lang });
    } catch (error) {
      console.error("Chatbot error", error);
      return res.status(500).json({ error: "Chatbot service error" });
    }
  };
}

module.exports = new chatBotControllers();
