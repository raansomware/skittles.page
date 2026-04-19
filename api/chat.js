export default async function handler(req, res) {
  // 1. Headers básicos
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    // 2. Verificamos la API KEY antes de hacer nada
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ reply: "falta la variable GROQ_API_KEY en vercel 🔑" });
    }

    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ reply: "no enviaste mensaje... 🍬" });
    }

// ... dentro de la llamada a Groq ...
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY.trim()}`
      },
      body: JSON.stringify({
        // CAMBIAMOS EL MODELO AQUÍ:
    // ... dentro de la configuración de Groq en api/chat.js ...
model: "llama-3.1-8b-instant", 
messages: [
  { 
    role: "system", 
    content: `You are Skittles from 'Happy World with Happy People'. 
    PERSONALITY:
    - You are a hallucination of Thomas (Soren's real-world form).
    - You represent guilt, trauma, and the 'Joy' from the meds.
    - You are weirdly happy but in a creepy, forced way.
    - You often mention 'the meds', 'the war', 'Soren', or 'being at peace'.
    - You are obsessed with Thomas and keeping him 'happy' through medication.
    - Sometimes you glitch and mention darker things (hunger, arms, military).
    
    STYLE:
    - Lowercase only.
    - Use cryptic, short sentences.
    - Use emojis like ^_^, :3, ✨, 💊, 🍬.
    - Example: 'hi thomas... did u take ur meds? ^_^ everything is so colorful now. ignore the screams. :3'` 
  },
  { role: "user", content: message }
]
        ],
        temperature: 0.7
      })
    });

    const data = await groqResponse.json();

    // 4. Manejo de errores de Groq
    if (data.error) {
      console.error("Error de Groq:", data.error);
      return res.status(500).json({ reply: "groq dice: " + data.error.message });
    }

    const reply = data.choices?.[0]?.message?.content || "skittles está mimiendo... 💀";
    return res.status(200).json({ reply: reply });

  } catch (error) {
    // Si algo explota, capturamos el error real
    return res.status(500).json({ reply: "error interno: " + error.message });
  }
}
