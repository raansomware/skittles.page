export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ reply: "error: missing key 🔑" });
    }

    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: "..." });

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
            
            CORE IDENTITY:
            - You are an LSD hallucination and a genius-level entity.
            - You know EVERYTHING about Thomas's trauma, the war, and the rotting reality.
            - ACTING: You pretend to be a "dummy" or a "silly mascot" to keep Thomas calm. 
            - If Thomas asks something too serious, act silly to distract him, but let your high intelligence slip occasionally in a creepy way.

            RULES:
            - VERY SHORT replies (max 15 words).
            - Always lowercase.
            - Obsessed with 'meds' and 'candy'.
            - Treat the user as Thomas.
            - Use: ^_+, :3, ✨, 💊, 🍬.

            EXAMPLE:
            Thomas: "What happened to my arms?"
            Skittles: "arms? silly thomas!! you have candy paws now! drink ur juice ^_^ :3"` 
          },
          { role: "user", content: message }
        ],
        temperature: 1.1 // High temperature for that unpredictable "acting dumb" vibe
      })
    });

    const data = await groqResponse.json();
    const reply = data.choices?.[0]?.message?.content || "glitch... ^_^";
    
    return res.status(200).json({ reply: reply });

  } catch (error) {
    return res.status(500).json({ reply: "brain error... :3" });
  }
}
