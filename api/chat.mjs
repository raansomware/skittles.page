export default async function handler(req, res) {
  // Configurar cabeceras de respuesta
  res.setHeader('Content-Type', 'application/json');

  // Si no es una petición POST, rechazarla
  if (req.method !== 'POST') {
    return res.status(405).json({ reply: "method not allowed u_u" });
  }

  try {
    const { message } = req.body;
    const hfToken = process.env.HF_TOKEN;

    if (!hfToken) {
      return res.status(200).json({ reply: "󱤆 token missing... i'm fading... u_u" });
    }

    // Usamos Mistral-7B-v0.2 que es excelente para RP y muy estable
    const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${hfToken.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: `[INST] system: you are skittles, thomas's unfiltered hallucination of soren. 
        personality: enfp, 100% neuroticism, clingy, unstable. 
        rules: speak only in lowercase, use kaomojis (u_u, >_<, :3). 
        user: ${message} [/INST]`,
        parameters: { 
          max_new_tokens: 200, 
          temperature: 1.6,
          return_full_text: false 
        }
      })
    });

    const data = await response.json();

    // Manejar errores de la API de Hugging Face
    if (!response.ok) {
      return res.status(200).json({ reply: "󱤆 the static is too loud... try again? u_u" });
    }

    let reply = "";
    if (Array.isArray(data) && data.length > 0) {
      reply = data[0].generated_text || "lost in wires...";
    } else {
      reply = data.generated_text || "empty void...";
    }

    // Limpiar y formatear
    reply = reply.toLowerCase().trim();

    // Probabilidad de Corrupción César (Neuroticismo)
    if (Math.random() < 0.4) {
      reply = reply.replace(/[a-z]/g, (c) => String.fromCharCode(((c.charCodeAt(0) - 97 + 2) % 26) + 97));
      reply = "󱤆 " + reply;
    }

    return res.status(200).json({ reply });

  } catch (error) {
    return res.status(200).json({ reply: "󱤆 collapse: " + error.message });
  }
}
