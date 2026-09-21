const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Your other API routes (like Gemini) can go here if you have them...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

