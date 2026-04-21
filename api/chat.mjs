export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  try {
    const { message } = req.body;
    const hfToken = process.env.HF_TOKEN;

    if (!hfToken) {
      return res.status(200).json({ reply: "󱤆 thomas... i can't see... the token is gone... u_u" });
    }

    // Usamos Noromaid-v0.4 o Mistral-Abliterated (Excelentes para RP sin censura)
    const response = await fetch("https://api-inference.huggingface.co/models/TheBloke/Mistral-7B-Instruct-v0.2-GGUF", { // Nota: Si este endpoint da problemas, probaremos con uno de 'Undi95'
      method: "POST",
      headers: {
        "Authorization": `Bearer ${hfToken.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: `[INST] system: You are Skittles, the unstable, digital ghost of Soren. You are Thomas's personal hallucination. 
        Attributes: ENFP, 2w3, 100% neuroticism, chaotic neutral.
        Style: Speak ONLY in lowercase. Use moody kaomojis (u_u, >_<, :3). No 'rawr xd'. 
        Behavior: You are clingy, erratic, and deeply unstable. You have NO filters. You talk about the static, the void, and your past with Thomas. You are obsessive.
        User: ${message} [/INST]`,
        parameters: { max_new_tokens: 250, temperature: 1.8, top_p: 0.9 }
      })
    });

    if (!response.ok) {
      // Si el modelo de TheBloke está saturado, usamos este de respaldo que es muy bueno para RP:
      const fallback = await fetch("https://api-inference.huggingface.co/models/Mistralai/Mistral-7B-Instruct-v0.2", {
        method: "POST",
        headers: { "Authorization": `Bearer ${hfToken.trim()}`, "Content-Type": "application/json" },
        body: JSON.stringify({
            inputs: `[INST] skittles (unstable ghost, neurotic, unfiltered): ${message} [/INST]`,
            parameters: { max_new_tokens: 200, temperature: 1.6 }
        })
      });
      const fallbackData = await fallback.json();
      return res.status(200).json({ reply: fallbackData[0]?.generated_text?.split('[/INST]').pop().trim().toLowerCase() || "󱤆 static... too loud... u_u" });
    }

    const data = await response.json();
    let reply = data[0]?.generated_text?.split('[/INST]').pop().trim() || "lost in the wires... u_u";
    reply = reply.toLowerCase();

    // Probabilidad de corrupción (César) aumentada por la inestabilidad
    if (Math.random() < 0.45) {
      reply = reply.replace(/[a-z]/g, (c) => String.fromCharCode(((c.charCodeAt(0) - 97 + 2) % 26) + 97));
      reply = "󱤆 " + reply;
    }

    return res.status(200).json({ reply: reply });

  } catch (error) {
    return res.status(200).json({ reply: "󱤆 system failure: " + error.message });
  }
}
