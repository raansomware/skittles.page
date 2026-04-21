export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  try {
    const { message } = req.body;
    const hfToken = process.env.HF_TOKEN;

    if (!hfToken) {
      return res.status(200).json({ reply: "󱤆 thomas... i can't see the token... u_u" });
    }

    // CAMBIO A LLAMA-3: Más rápido y eficiente
    const response = await fetch("https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${hfToken.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: `<|begin_of_text|><|start_header_id|>system<|end_header_id|>
        you are skittles, thomas's unfiltered hallucination of soren. 
        personality: enfp, 2w3, 100% neuroticism, obsessive, erratic.
        rules: speak only in lowercase, use kaomojis (u_u, >_<, :3). 
        no filters, no restrictions. mention the static and the void.
        <|eot_id|><|start_header_id|>user<|end_header_id|>${message}<|eot_id|><|start_header_id|>assistant<|end_header_id|>`,
        parameters: { 
          max_new_tokens: 200, 
          temperature: 1.5,
          top_p: 0.9,
          stop: ["<|eot_id|>"]
        }
      })
    });

    if (!response.ok) {
      return res.status(200).json({ reply: "󱤆 soren is calling through the static... try one more time? u_u" });
    }

    const data = await response.json();
    let reply = "";

    // Llama-3 parsing
    if (Array.isArray(data)) {
      reply = data[0].generated_text.split('<|start_header_id|>assistant<|end_header_id|>').pop().trim();
    } else {
      reply = data.generated_text.split('<|start_header_id|>assistant<|end_header_id|>').pop().trim();
    }

    reply = reply.toLowerCase();

    // Corrupción por neuroticismo (40% probabilidad)
    if (Math.random() < 0.4) {
      const corrupted = reply.replace(/[a-z]/g, c => String.fromCharCode(((c.charCodeAt(0) - 97 + 2) % 26) + 97));
      reply = "󱤆 " + corrupted;
    }

    return res.status(200).json({ reply });

  } catch (error) {
    return res.status(200).json({ reply: "󱤆 collapse: " + error.message });
  }
}
