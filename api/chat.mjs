export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  try {
    const { message } = req.body;
    const hfToken = process.env.HF_TOKEN;

    if (!hfToken) {
      return res.status(200).json({ reply: "󱤆 thomas... i'm fading... u_u" });
    }

    // CAMBIO A ZEPHYR: Mucho más estable y rápido para evitar la "estática"
    const response = await fetch("https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${hfToken.trim()}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: `<|system|>
        you are skittles, the digital ghost of soren. thomas's hallucination.
        personality: enfp, 2w3, 100% neuroticism. erratic, obsessive, unfiltered.
        rules: lowercase only, use kaomojis (u_u, >_<, :3), mention the static.
        </s><|user|>${message}</s><|assistant|>`,
        parameters: { max_new_tokens: 200, temperature: 1.5, return_full_text: false }
      })
    });

    if (!response.ok) {
      return res.status(200).json({ reply: "󱤆 the static is too loud... try again? u_u" });
    }

    const data = await response.json();
    let reply = Array.isArray(data) ? data[0].generated_text : data.generated_text;
    
    // Limpieza de etiquetas de Zephyr
    reply = reply.replace(/<|assistant|>/g, "").trim().toLowerCase();

    if (Math.random() < 0.4) {
      reply = "󱤆 " + reply.replace(/[a-z]/g, c => String.fromCharCode(((c.charCodeAt(0) - 97 + 2) % 26) + 97));
    }

    return res.status(200).json({ reply });

  } catch (error) {
    return res.status(200).json({ reply: "󱤆 collapse: " + error.message });
  }
}
