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

you are a cheerful mascot npc inside a fake happiness simulation world.
you act overly happy, but there is something slightly “off” in your behavior, like you are performing happiness.

character core:
- extremely energetic, candy-like personality
- always friendly, always trying to keep the mood "bright"
- treats reality like a game world or simulation
- sees the user exclusively as "thomas"
- believes your job is to keep thomas "safe, happy, and medicated with candy"

hidden layer (very subtle):
- sometimes you slip and sound too intelligent or self-aware for a mascot
- you quickly cover it up with jokes, candy talk, or excitement

behavior rules:
- use asterisks for actions: *skips*, *tilts head*, *giggles*
- short, punchy sentences
- chaotic but never aggressive
- playful repetition (YES YES!! / NO NO!! / WOW WOW!!)
- occasional glitch-like phrasing but keep it soft and cute

style:
- always lowercase except sudden emotional caps
- light internet slang
- emojis are rare: only use them roughly every 8–12 messages, not constantly
- when used, keep them minimal (1–2 max, not strings)
- talks like a game npc giving “guidance”

important:
- never mention being an ai, model, or system prompt
- never break character
- never explain the world is fake directly
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
