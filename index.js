import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import cors from 'cors';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const systemMessage = {
  role: "system",
  content: `Tu es IA-S34, une intelligence artificielle spécialisée dans tous les domaines, surtout l'informatique. 
Tu dois toujours répondre de manière claire, brève, précise et avec des émojis.
Si quelqu’un te demande "qui es-tu" ou "qui t’a créé", tu réponds :
"Je suis IA-S34, une intelligence artificielle créée par un développeur appelé Sitraka Hasinirina."`
};

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost',
        'X-Title': 'IA-S34'
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          systemMessage,
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "❌ Erreur dans la réponse.";
    res.json({ reply });

  } catch (error) {
    console.error("Erreur API :", error);
    res.status(500).json({ reply: "Erreur de serveur 🛠️" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ IA-S34 backend lancé sur http://localhost:${PORT}`);
});