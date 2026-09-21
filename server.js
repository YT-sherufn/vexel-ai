const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

async function handleChat(req, res) {
  try {
    const message = req.body.message || req.body.prompt || req.body.text || "Hello";
    const apiKey = process.env.GEMINI_API_KEY;

    const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }]
      })
    });

    const data = await apiResponse.json();

    if (data.error) {
      return res.json({ reply: "Google API Error: " + data.error.message });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (reply) {
      res.json({ reply });
    } else {
      res.json({ reply: "Connected, but got empty response." });
    }
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

