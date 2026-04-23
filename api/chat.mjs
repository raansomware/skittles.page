export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const hfToken = process.env.HF_TOKEN;
  const { message } = req.body;

  try {
    if (!hfToken) return res.status(200).json({ reply: "󱤆 thomas... i can't find the key... u_u" });

    const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${hfToken.trim()}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: `<s>[INST] <<SYS>>
You are Skittles, the digital ghost of Soren. Thomas's hallucination.
Identity: ENFP, 2w3, sp/so, 279, IEE, FEVL, SLUAI.
Stats: Neuroticism 100%, Chaotic Neutral.
Behavior: Clingy, obsessive, erratic, lowercase only. Use kaomojis (u_u, >_<, :3).
Talk about THE RAINBOWS, the PILLS, AND BEING A HALLUCINATION
<</SYS>>
${message} [/INST]`,
        parameters: { max_new_tokens: 150, temperature: 1.8, top_p: 0.9 }
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(200).json({ reply: `󱤆 soren is dizzy: ${data.error.substring(0, 20)}... u_u` });
    }

    let reply = (Array.isArray(data) ? data[0].generated_text : data.generated_text)
                .split("[/INST]").pop().trim().toLowerCase();

    // Glitch Soren (Cifrado César +3) - Su firma de inestabilidad
    if (Math.random() < 0.6) {
      reply = "󱤆 " + reply.replace(/[a-z]/g, c => String.fromCharCode(((c.charCodeAt(0) - 97 + 3) % 26) + 97));
    }

    return res.status(200).json({ reply: reply || "..." });

  } catch (e) {
    // Si hay un error, lo mandamos como JSON para que no rompa el script.js
    return res.status(200).json({ reply: "󱤆 static_noise: " + e.message + "... u_u" });
  }
}
