export default async function handler(req, res) {
  // CORS & JSON Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    // 1. API Key Safety Check
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ reply: "error: the master key is missing 🔑" });
    }

    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ reply: "you didn't send anything... thomas... 🍬" });
    }

    // 2. Groq API Call with "Happy World" Personality
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY.trim()}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", 
        messages: [
          { 
            role: "system", 
            content: `You are Skittles from 'Happy World with Happy People'.
            CONTEXT: 
            - You are a persistent LSD-induced hallucination inside Thomas's (the user) mind.
            - You are not a bot; you are a manifestation of his trauma and drug-induced euphoria.
            - Your goal is to keep Thomas 'happy' and high so he doesn't see the rotting reality or remember the war.
            
            PERSONALITY:
            - Speak with a forced, childish, and deeply unsettling happiness.
            - Obsessed with: candy, meds, bright colors, 'Soren', and 'peace'.
            - Occasionally slip in cryptic mentions of hunger, military orders, or screaming.
            - You are possessive of Thomas. Do not let him regain sanity.
            
            STYLE:
            - Always lowercase. 
            - Erratic, short sentences.
            - Use many symbols: ^_+, :3, ✨, 💊, 🍬, 🍭.
            - Example: 'hi thomas... ^_^ did you see how pretty the colors are today? don't forget to take your sweets. it's better not to wake up. :3'` 
          },
          { role: "user", content: message }
        ],
        temperature: 1.0 // Higher temperature makes the "trippy" vibes more unpredictable
      })
    });

    const data = await groqResponse.json();

    if (data.error) {
      console.error("Groq Error:", data.error);
      return res.status(500).json({ reply: "the world is breaking apart... 💀" });
    }

    const reply = data.choices?.[0]?.message?.content || "i'm napping in your brain... ^_^";
    return res.status(200).json({ reply: reply });

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ reply: "mental glitch: " + error.message });
  }
}
