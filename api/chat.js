export default async function handler(req, res) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  // Forzamos la lectura del cuerpo si req.body viene vacío
  let body = req.body;

  try {
    const userMessage = body?.message || body?.prompt;

    if (!userMessage) {
      // Si llegamos aquí, imprimimos en los logs de Vercel para debuguear
      console.log("Cuerpo recibido vacío o inválido:", body);
      return res.status(400).json({ 
        error: "No message provided in body", 
        received: body,
        type: typeof body 
      });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: "you are skittles bot. speak lowercase, short, cute chaotic slang. use :3 ^^ ✨." },
          { role: "user", content: userMessage }
        ],
        temperature: 1.1
      })
    });

    const data = await response.json();
    return res.status(200).json({ reply: data.choices?.[0]?.message?.content || "glitch... 💀" });

  } catch (err) {
    return res.status(500).json({ error: "Server Error", details: err.message });
  }
}
