export default async function handler(req, res) {
  // ============================
  // CONFIGURACIÓN DE CORS
  // ============================
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Manejo de pre-vuelo de CORS
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Solo aceptamos peticiones POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // Extraemos el prompt o message del cuerpo de la petición
    const { prompt, message } = req.body;
    const userText = prompt || message; // Acepta ambos nombres de variable por si acaso

    if (!userText) {
      return res.status(400).json({ error: "No message provided" });
    }

    // ============================
    // LLAMADA A GROQ API
    // ============================
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: "you are nick.bot (aka skittles/soren). you speak like skittles from hwwhp. always lowercase. short replies. cute chaotic slang. use ^^ :3 ✨💖. sometimes remind people to take ur medz. never formal. stay in character as a pixels/glitter entity."
          },
          { role: "user", content: userText }
        ],
        temperature: 1.1,
        max_tokens: 120
      })
    });

    const data = await response.json();

    // Verificamos si Groq devolvió un error (como API Key inválida)
    if (data.error) {
      console.error("Groq Error:", data.error);
      return res.status(500).json({ error: data.error.message });
    }

    // Devolvemos la respuesta formateada
    const reply = data.choices?.[0]?.message?.content || "nick.bot crashed 💀";
    
    // Devolvemos tanto 'content' como 'reply' para que coincida con lo que busque tu script.js
    return res.status(200).json({
      content: reply,
      reply: reply 
    });

  } catch (err) {
    console.error("Server Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
