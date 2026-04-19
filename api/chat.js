export default async function handler(req, res) {
  // Encabezados para evitar errores de conexión
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    // 1. Obtenemos el mensaje del usuario
    const body = req.body;
    const userMessage = body?.message || body?.prompt;

    if (!userMessage) {
      return res.status(400).json({ error: "No message provided" });
    }

    // 2. Llamada a Groq (Asegúrate de que la API Key esté en Vercel)
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: "you are skittles. speak lowercase. short replies. cute chaotic slang. use ^^ :3 ✨💖." },
          { role: "user", content: userMessage }
        ],
        temperature: 0.8 // Bajamos un poco la temperatura para mayor estabilidad
      })
    });

    const data = await groqRes.json();

    // 3. EXTRAER EL TEXTO (Aquí es donde solía fallar)
    // Buscamos el texto dentro de la estructura de Groq
    const aiText = data.choices?.[0]?.message?.content;

    if (aiText) {
      return res.status(200).json({ reply: aiText });
    } else {
      // Si Groq devuelve un error, lo enviamos para verlo en consola
      console.error("Groq Error:", data);
      return res.status(500).json({ 
        reply: "glitch... 💀", 
        debug: data // Esto nos dirá si es culpa de la API KEY
      });
    }

  } catch (err) {
    console.error("Server Error:", err);
    return res.status(500).json({ reply: "server glitch... 💀", details: err.message });
  }
}
