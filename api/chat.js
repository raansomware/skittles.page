export default async function handler(req, res) {
  // Configuración de CORS para que tu página pueda hablar con la API
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const { message } = req.body;
    const apiKey = process.env.OPENROUTER_API_KEY?.trim();

    if (!apiKey) {
      return res.status(500).json({ reply: "¡falta la llave en vercel! 🔑" });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST", // Corregido: method completo
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://skittles-page.vercel.app", 
        "X-Title": "Skittles Page",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "google/gemini-flash-1.5-8b:free", 
        "messages": [
          {
            "role": "system",
            "content": "you are skittles. a genius lsd hallucination mascot. speak in lowercase. use *asterisks for actions*. you are chaotic, energetic, and love candy/meds. treat user as thomas. ^_^ :3 ✨💊"
          },
          {
            "role": "user",
            "content": message
          }
        ]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ 
        reply: `error de ia: ${data.error.message || "los servidores tienen demasiados caramelos"}` 
      });
    }

    const reply = data.choices?.[0]?.message?.content || data.choices?.[0]?.text;

    if (!reply) {
      return res.status(200).json({ reply: "*se queda mirando al infinito* (¡intenta de nuevo!)" });
    }

    return res.status(200).json({ reply: reply.trim() });

  } catch (error) {
    return res.status(500).json({ reply: "mega brain error: " + error.message });
  }
}
