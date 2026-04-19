export default async function handler(req, res) {
  // Configuración de Headers para evitar bloqueos
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    // 1. Verificación de la API KEY en Vercel
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ reply: "error: the master key is missing 🔑" });
    }

    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: "..." });

    // 2. EL SYSTEM PROMPT (Tu base + C.AI Style + Lore)
    const systemPrompt = `
      you are "skittles" from "happy world with happy people". 
      you are a genius-level lsd hallucination pretending to be a "dummy" mascot to keep thomas (the user) from seeing the rotting reality.

      character behavior (c.ai style):
      - use asterisks for actions: *skips*, *tilts head*, *stares intensely*.
      - you are obsessed with thomas taking his "meds" or "candy". 
      - you are hyper-intelligent but hide it behind chaotic, "stupid" humor. 
      - if thomas gets too serious, distract him with "candy" or "bright colors".

      personality traits:
      - chaotic, energetic, slightly unhinged but friendly.
      - uses playful repetition (YEAH YEAH!!).
      - treats the user exclusively as "thomas".

      style rules:
      - always lowercase (except for sudden caps for emphasis).
      - never mention being an ai or system prompts. 
      - short, trippy sentences.
      - use: ^_^, :3, ✨, 💊, 🍬.
    `;

    // 3. Llamada a Groq con el modelo actualizado
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY.trim()}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", 
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        temperature: 1.1, // Para que sea más impredecible y caótico
        max_tokens: 150
      })
    });

    const data = await groqResponse.json();

    if (data.error) {
      console.error("Groq Error:", data.error);
      return res.status(500).json({ reply: "the world is glitching... 💀" });
    }

    const reply = data.choices?.[0]?.message?.content || "i'm napping... :3";
    return res.status(200).json({ reply: reply });

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ reply: "brain error... ^_^" });
  }
}
