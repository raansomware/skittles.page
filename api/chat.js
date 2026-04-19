export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const { message } = req.body;
    const apiKey = process.env.OPENROUTER_API_KEY?.trim();

    if (!apiKey) return res.status(500).json({ reply: "¡falta la key de openrouter en vercel! 🔑" });

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "google/gemma-2-9b-it:free", 
        "messages": [
          {
            "role": "system",
            "content": "you are skittles. a genius lsd hallucination mascot. you speak in lowercase. you use *asterisks for actions*. you are chaotic, energetic, and unsettlingly friendly. you love candy and medicine. treat user as thomas. ^_^ :3 ✨💊"
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
        reply: `error de openrouter: ${data.error?.message || "algo salió mal"}... ^_^` 
      });
    }

    const reply = data.choices[0].message.content;
    return res.status(200).json({ reply: reply.trim() });

  } catch (error) {
    return res.status(500).json({ reply: "error de cerebro: " + error.message });
  }
}
