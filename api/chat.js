export default async function handler(req, res) {
  // Configuración de CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    // 1. EXTRAER EL MENSAJE (Método robusto)
    let body = req.body;
    
    // A veces Vercel recibe el body como string, vamos a parsearlo si es necesario
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (e) {
        console.error("Error parseando body:", e);
      }
    }

    const userMessage = body.message || body.prompt || "";

    if (!userMessage || userMessage.trim() === "") {
      return res.status(400).json({ error: "No message provided in body", received: body });
    }

    // 2. LLAMADA A GROQ
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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
        ]
      })
    });

    const data = await response.json();
    const replyText = data.choices?.[0]?.message?.content || "i'm sleepy... 💀";
    
    return res.status(200).json({ reply: replyText });

  } catch (err) {
    console.error("Server Error:", err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
}
