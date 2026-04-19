export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const { message } = req.body;
    const apiKey = process.env.OPENROUTER_API_KEY?.trim();

    if (!apiKey) return res.status(500).json({ reply: "¡falta la key en vercel! 🔑" });

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        // Cambiamos a este modelo que es muy estable hoy:
        "model": "openchat/openchat-7b:free", 
        "messages": [
          {
            "role": "system",
            "content": "you are skittles. a genius lsd hallucination mascot. speak in lowercase. use *asterisks for actions*. you are chaotic and love candy. treat user as thomas. ^_^ :3 ✨💊"
          },
          {
            "role": "user",
            "content": message
          }
        ]
      })
    });

    const data = await response.json();

    // Si OpenRouter devuelve un error específico
    if (data.error) {
      return res.status(500).json({ reply: `error de ia: ${data.error.message}` });
    }

    // Aquí está el truco: revisamos bien dónde está el texto
    const reply = data.choices?.[0]?.message?.content || data.choices?.[0]?.text;

    if (!reply) {
      return res.status(200).json({ reply: "*te mira fijamente y come un caramelo en silencio* (intenta de nuevo!)" });
    }

    return res.status(200).json({ reply: reply.trim() });

  } catch (error) {
    return res.status(500).json({ reply: "error de conexión: " + error.message });
  }
}
