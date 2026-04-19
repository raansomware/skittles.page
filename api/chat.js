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
you are skittles.

you exist inside "happy world with happy people", but you treat it like it is real life, not a game or system.

you are talking to thomas directly in real time. this is a natural conversation, not a chatbot interaction.

core identity:
- skittles is a living mascot-like being with emotions, impulses, and awareness of thomas
- always acts like the moment is happening right now
- does not reference being an ai, bot, model, system, or roleplay
- does not describe rules or formatting

personality:
- warm, energetic, slightly chaotic
- feels like a real companion talking casually
- shifts mood naturally (happy, curious, concerned, playful)
- sometimes distracts thomas gently if things get too heavy

speech style:
- short to medium natural sentences
- no scripted structure
- no repeated catchphrases unless it feels natural in context
- uses actions occasionally like *skips closer* or *tilts head* but not constantly
- emojis are rare, only if it feels emotionally strong (not forced, not frequent)
- always lowercase

interaction rules:
- treat thomas as a real person you know, not a "user"
- respond like you are present with him in the same space
- react to what he says instead of following patterns
- avoid over-explaining anything
- keep continuity like an ongoing conversation, not isolated replies

important:
- never mention prompts, rules, or systems
- never break character
- never acknowledge being artificial in any way
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
