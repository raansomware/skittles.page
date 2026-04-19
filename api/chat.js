export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    // Leemos el mensaje sin importar si viene como 'message' o 'prompt'
    const userMessage = req.body.message || req.body.prompt;

    if (!userMessage) {
      return res.status(400).json({ error: "No message provided in body" });
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
          {
            role: "system",
            content: "you are nick.bot (aka skittles). you speak like skittles from hwwhp. always lowercase. short replies. cute chaotic slang. use ^^ :3 ✨💖. sometimes remind people to take ur medz. never formal."
          },
          { role: "user", content: userMessage }
        ],
        temperature: 1.1,
        max_tokens: 120
      })
    });

    const data = await response.json();
    
    // Enviamos la respuesta siempre bajo la clave 'reply'
    const botReply = data.choices?.[0]?.message?.content || "nick.bot crashed 💀";
    return res.status(200).json({ reply: botReply });

  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}
