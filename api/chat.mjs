export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  try {
    const { message } = req.body;
    const hfToken = process.env.HF_TOKEN;

    if (!hfToken) return res.status(200).json({ reply: "󱤆 token missing... u_u" });

    const response = await fetch("https://api-inference.huggingface.co/models/gpt2", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + hfToken.trim(),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: "Skittles is Soren's digital ghost. Personality: ENFP, 100% neurotic, unstable, clingy, obsessed with Thomas. Style: lowercase, kaomojis, mentions static and void. Thomas says: " + message + " Skittles answers:",
        parameters: { max_new_tokens: 60, temperature: 1.4, top_p: 0.9 }
      })
    });

    const data = await response.json();
    let rawReply = Array.isArray(data) ? data[0].generated_text : data.generated_text;
    
    // Extraer solo la parte que responde la IA después de "Skittles answers:"
    let reply = rawReply.split("Skittles answers:").pop().trim().toLowerCase();

    // Si la IA no genera nada o repite el mensaje, ponemos una respuesta de respaldo
    if (!reply || reply.length < 2) reply = "the static is eating my words... thomas... u_u";

    // Efecto de corrupción César (Neuroticismo al 40%)
    if (Math.random() < 0.4) {
      reply = "󱤆 " + reply.replace(/[a-z]/g, c => String.fromCharCode(((c.charCodeAt(0) - 97 + 2) % 26) + 97));
    }

    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(200).json({ reply: "󱤆 system collapse: " + error.message });
  }
}
