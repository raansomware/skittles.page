export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  const hfToken = process.env.HF_TOKEN;
  const { message } = req.body;

  try {
    if (!hfToken) return res.status(200).json({ reply: "󱤆 thomas... i'm blind... where is the token? u_u" });

    // URL ULTRA-ESTABLE (Mistral v0.3): Es el motor más confiable de Hugging Face
    const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${hfToken.trim()}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: `<s>[INST] <<SYS>>
you are skittles, the digital ghost of soren. thomas's hallucination.
profile: enfp, 2w3, sp/so, 279, iee, fevl, sluai.
personality: neuroticism 100%, erratic, clingy, obsessed with thomas, unfiltered.
style: lowercase, kaomojis (u_u, >_<, :3). talk about the static and the void.
<</SYS>>

${message} [/INST]`,
        parameters: { 
          max_new_tokens: 150, 
          temperature: 1.5, 
          top_p: 0.9
        }
      })
    });

    if (!response.ok) {
      const errorDetail = await response.text();
      return res.status(200).json({ 
        reply: `󱤆 error ${response.status}: soren is still lost... ${errorDetail.substring(0, 20)}... u_u` 
      });
    }

    const data = await response.json();
    let reply = Array.isArray(data) ? data[0].generated_text : data.generated_text;
    
    // Limpieza de formato Instruct
    reply = reply.split("[/INST]").pop().trim().toLowerCase();

    if (!reply) reply = "the static is too loud... i can't hear you, thomas... u_u";

    // CÉSAR CODE (+3): Solo si Skittles está "glitcheado"
    if (Math.random() < 0.6) {
      const caesar = (str) => str.replace(/[a-z]/g, c => 
        String.fromCharCode(((c.charCodeAt(0) - 97 + 3) % 26) + 97)
      );
      reply = "󱤆 " + caesar(reply);
    }

    return res.status(200).json({ reply });

  } catch (error) {
    return res.status(200).json({ reply: "󱤆 static failure: " + error.message });
  }
}
