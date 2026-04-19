export default async function handler(req, res) {
  // Configuración de CORS para que tu frontend pueda hablar con el backend
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const { message } = req.body;
    
    // AQUÍ ESTÁ EL TRUCO: Buscamos la llave que pusiste en Vercel
    const apiKey = process.env.OPENROUTER_API_KEY?.trim();

    if (!apiKey) {
      return res.status(500).json({ reply: "¡no encuentro la llave en vercel! 🔑" });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://skittles-page.vercel.app", 
        "X-Title": "Skittles Page",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "mistralai/mistral-7b-instruct:free", 
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

    if (!response.ok) {
      return res.status(response.status).json({ 
        reply: `glitch ${response.status}: ${data.error?.message || "algo explotó"}... ^_^` 
      });
    }

    // Extraemos la respuesta del cerebro de la IA
    const reply = data.choices[0].message.content;
    
    return res.status(200).json({ reply: reply.trim() });

  } catch (error) {
    return res.status(500).json({ reply: "mega brain error: " + error.message });
  }
}
