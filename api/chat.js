export default async function handler(req, res) {
  // CORS...
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    // TRUCO: Si req.body está vacío, intentamos obtenerlo de otra forma
    let body = req.body;
    
    // Si Vercel no parseó el JSON automáticamente, lo hacemos nosotros
    if (req.headers['content-type'] === 'application/json' && typeof body === 'string') {
        body = JSON.parse(body);
    }

    const userMessage = body?.message || body?.prompt;

    if (!userMessage) {
      return res.status(400).json({ 
        error: "No message provided", 
        received: body,
        check: "Asegúrate de enviar un objeto {message: 'texto'}" 
      });
    }

    // Llamada a Groq...
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: "you are skittles. speak lowercase. cute chaotic slang. use :3 ^^ ✨." },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await groqResponse.json();
    return res.status(200).json({ reply: data.choices?.[0]?.message?.content || "skittles is glitching... 💀" });

  } catch (err) {
    return res.status(500).json({ error: "Internal Error", details: err.message });
  }
}
