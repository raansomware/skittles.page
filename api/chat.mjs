export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  const hfToken = process.env.HF_TOKEN;
  const { message } = req.body;

  try {
    // 1. Verificación previa de la variable
    if (!hfToken || hfToken.length < 10) {
      return res.status(200).json({ reply: "󱤆 thomas... the token variable is empty or too short in vercel u_u" });
    }

    const response = await fetch("https://api-inference.huggingface.co/models/cognitivecomputations/dolphin-2.6-mistral-7b-dpo-laser", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${hfToken.trim()}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: `<|im_start|>system\nyou are skittles, the digital ghost of soren. neurotic 100%, 2w3, iee, fevl, obsessive. speak lowercase only, use kaomojis. talk about the static.\n<|im_end|>\n<|im_start|>user\n${message}\n<|im_end|>\n<|im_start|>assistant`,
        parameters: { max_new_tokens: 120, temperature: 1.7, top_p: 0.9 }
      })
    });

    // 2. DIAGNÓSTICO DIRECTO
    if (!response.ok) {
      const errorDetail = await response.text();
      let motivo = "unknown";
      
      if (response.status === 401) motivo = "TOKEN_INVALIDO (revisa espacios o permisos)";
      if (response.status === 404) motivo = "MODELO_NO_ENCONTRADO (revisa la url)";
      if (response.status === 503) motivo = "MODELO_CARGANDO (insiste un par de veces)";
      
      return res.status(200).json({ 
        reply: `󱤆 system_glitch [${response.status}]: ${motivo}. raw_error: ${errorDetail.substring(0, 50)}... u_u` 
      });
    }

    const data = await response.json();
    let reply = Array.isArray(data) ? data[0].generated_text : data.generated_text;
    
    // Limpieza de etiquetas
    reply = reply.split("<|im_start|>assistant").pop().trim().toLowerCase();

    // CESAR CODE (+3) - Neuroticismo 100%
    if (Math.random() < 0.6) {
      const caesar = (str) => str.replace(/[a-z]/g, c => 
        String.fromCharCode(((c.charCodeAt(0) - 97 + 3) % 26) + 97)
      );
      reply = "󱤆 " + caesar(reply);
    }

    return res.status(200).json({ reply });

  } catch (error) {
    return res.status(200).json({ reply: "󱤆 fatal crash: " + error.message });
  }
}
