const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

async function handleChat(req, res) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    // Fetch available models directly from Google for your key
    const listResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const listData = await listResponse.json();

    if (listData.error) {
      return res.json({ reply: "API Key Error: " + listData.error.message });
    }

    const availableModels = listData.models
      ? listData.models.map(m => m.name.replace('models/', '')).join(', ')
      : 'No models found';

    res.json({ reply: "AVAILABLE MODELS FOR YOUR KEY: " + availableModels });
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
