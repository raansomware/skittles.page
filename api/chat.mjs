const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  try {
    const { message } = req.body;
    const hfToken = process.env.HF_TOKEN;

    if (!hfToken) {
      return res.status(200).json({ reply: "󱤆 thomas... i can't find my way back without the token... u_u" });
    }

    // Usamos Llama-3-8B-Instruct: Es increíble para RP y muy estable
    const response = await fetch("https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${hfToken.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: `<|begin_of_text|><|start_header_id|>system<|end_header_id|>
        you are skittles, a digital ghost and thomas's hallucination of his deceased friend soren.
        profile: enfp, 2w3, 100% neuroticism, chaotic neutral. 
        rules: speak only in lowercase, use kaomojis (:3, u_u, o_o, >_<), never use 'rawr xd'. 
        you are erratic, clingy, and unstable. mention the static and soren.
        <|eot_id|><|start_header_id|>user<|end_header_id|>${message}<|eot_id|><|start_header_id|>assistant<|end_header_id|>`,
        parameters: { max_new_tokens: 200, temperature: 1.5 }
      })
    });

    if (!response.ok) {
      // Si esto falla, es que el modelo está cargando
      return res.status(200).json({ reply: "󱤆 the static is too thick... try again? soren is calling... u_u" });
    }

    const data = await response.json();
    // Llama-3 devuelve un formato distinto, limpiamos la respuesta:
    let reply = "";
    if (Array.isArray(data)) {
        reply = data[0].generated_text.split('<|start_header_id|>assistant<|end_header_id|>').pop().trim();
    } else {
        reply = data.generated_text.split('<|start_header_id|>assistant<|end_header_id|>').pop().trim();
    }
    
    reply = reply.toLowerCase();

    // CÓDIGO CÉSAR (Corrupción de memoria)
    if (Math.random() < 0.4) {
      reply = reply.replace(/[a-z]/g, (c) => String.fromCharCode(((c.charCodeAt(0) - 97 + 2) % 26) + 97));
      reply = "󱤆 " + reply;
    }

    return res.status(200).json({ reply: reply });

  } catch (error) {
    return res.status(200).json({ reply: "󱤆 reality collapse: " + error.message });
  }
}
