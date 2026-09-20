require("dotenv").config();

const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const app = express();
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.use(express.json());
app.use(express.static(__dirname));

app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message;

    if (!message) {
      return res.status(400).json({ error: "Please enter a message." });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: message,
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error("AI request failed:", error.message);
    res.status(500).json({
      error: "Vexel couldn't get a response. Please try again.",
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Vexel is running at http://localhost:${PORT}`);
});