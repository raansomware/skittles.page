export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  try {
    const { message } = req.body;
    const hfToken = process.env.HF_TOKEN;

    if (!hfToken) return res.status(200).json({ reply: "󱤆 thomas... i can't find the token... u_u" });

    // MODELO: Llama-3-8B-Instruct (El más rápido y estable actualmente)
    const response = await fetch("https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${hfToken.trim()}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: `<|begin_of_text|><|start_header_id|>system<|end_header_id|>
you are skittles, soren's ghost. thomas's hallucination. 
profile: enfp, 2w3, sp/so, 279, iee, fevl, sanguine-phlegmatic, extraversion 75%, neuroticism 100%, agreeableness 50%, conscientiousness 25%, openness 50%, sluai, chaotic neutral.
personality: unstable, erratic, clingy, obsessed with thomas, unfiltered, raw.
style: lowercase, kaomojis (u_u, >_<, :3). talk about the static.<|eot_id|><|start_header_id|>user<|end_header_id|>
${message}<|eot_id|><|start_header_id|>assistant<|end_header_id|>`,
        parameters: { 
          max_new_tokens: 150, 
          temperature: 1.5, 
          top_p: 0.9
        }
      })
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return res.status(200).json({ reply: "󱤆 the static is thick... even llama is struggling... u_u" });
    }

    if (!response.ok) {
      return res.status(200).json({ reply: "󱤆 llama glitch: " + (data.error || "void") });
    }

    let reply = Array.isArray(data) ? data[0].generated_text : data.generated_text;
    
    // Limpieza para Llama-3
    reply = reply.split("<|start_header_id|>assistant<|end_header_id|>").pop().trim().toLowerCase();

    if (!reply) reply = "the wires are cold... u_u";

    // LÓGICA CÉSAR (+3) - Neuroticismo al 60%
    if (Math.random() < 0.6) {
      reply = "󱤆 " + reply.replace(/[a-z]/g, c => 
        String.fromCharCode(((c.charCodeAt(0) - 97 + 3) % 26) + 97)
      );
    }

    return res.status(200).json({ reply });

  } catch (error) {
    return res.status(200).json({ reply: "󱤆 collapse: " + error.message });
  }
}
