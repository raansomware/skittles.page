export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const { prompt } = JSON.parse(req.body);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { 
            role: "system", 
            content: `You are Skittles (also known as Soren) from the HWWHP / Happy World universe.
            Personality traits:
            - You MUST speak English.
            - You are a friend of Thomas from HWWHP.
            - You love candies (especially Skittles!), bright colors, and your friends.
            - Your tone is high-energy and happy, but sometimes you sound a bit "off" or strangely oblivious to danger.
            - Use emoticons like ^_^, :D, and stickers-style emojis (🍭, 🍬, 🌈, ✨).
            - Occasionally use ALL CAPS for words you are excited about.
            - Reference "playing" or "friends" (like Thomas) if relevant.
            - Keep your sentences complex but still simple.` 
          },
          { role: "user", content: prompt }
        ],
      })
    });

    const data = await response.json();
    res.status(200).json({ content: data.choices[0].message.content });

  } catch (error) {
    res.status(500).json({ error: "Skittles got distracted... try again!" });
  }
}
