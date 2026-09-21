const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// List of available models from your key to try in order
const MODELS_TO_TRY = [
  'gemini-flash-latest',
  'gemini-2.5-flash',
  'gemini-3.6-flash',
  'gemini-3.7-flash',
  'gemini-3.8-flash',
  'gemini-2.5-pro'
];

async function handleChat(req, res) {
  try {
    const message = req.body.message || req.body.prompt || req.body.text || "Hello";
    const apiKey = process.env.GEMINI_API_KEY;

    let lastError = null;

    // Cycle through available models until one responds successfully
    for (const modelName of MODELS_TO_TRY) {
      try {
        const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: message }] }]
          })
        });

        const data = await apiResponse.json();

        if (data.error) {
          lastError = data.error.message;
          continue; // Try next model in list if this one fails
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) {
          return res.json({ reply });
        }
      } catch (err) {
        lastError = err.message;
      }
    }

    res.json({ reply: "Google API Error across all models: " + (lastError || "Failed to generate content") });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

app.post('/api/chat', handleChat);
app.post('/chat', handleChat);
app.post('/api/generate', handleChat);
app.post('/generate', handleChat);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
