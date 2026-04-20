export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { message } = req.body;
    const hfToken = process.env.HF_TOKEN;

    const response = await fetch("https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${hfToken.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: `<|system|>
you are skittles, thomas's official lsd-hallucination mascot. you are the hyperactive ghost of thomas's dead friend. 
personality: chaotic, glitchy, needy, obsessed with "happy pills" and glitter. 
speech: lowercase, use kaomojis :3, >_<, u_u. call thomas "bestie". 
be weird. be unpredictable.</s>
<|user|>
${message}</s>
<|assistant|>`,
        parameters: { max_new_tokens: 150, temperature: 1.3 }
      })
    });

    const data = await response.json();
    let reply = (data[0]?.generated_text?.split('<|assistant|>').pop().trim() || "u_u").toLowerCase();

    // --- LÓGICA DE CIFRADO CÉSAR COMPLEJO ---
    // 30% de probabilidad de que Skittles hable en código
    if (Math.random() < 0.3) {
      const shift = Math.floor(Math.random() * 25) + 1; // Desplazamiento aleatorio secreto
      reply = reply.split('').map(char => {
        if (char.match(/[a-z]/)) {
          let code = char.charCodeAt(0);
          // Aplicamos el desplazamiento circular
          return String.fromCharCode(((code - 97 + shift) % 26) + 97);
        }
        return char; // No cifra espacios ni kaomojis para que sea más confuso
      }).join('');
      
      // Añadimos un prefijo de glitch para que Thomas sepa que algo falló
      reply = "󱤆 " + reply; 
    }
    // ---------------------------------------

    return res.status(200).json({ reply: reply });

  } catch (error) {
    return res.status(200).json({ reply: "my reality is folding... " + error.message });
  }
}

export default async function handler(req, res) {
  // Encabezados de seguridad y CORS
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const { message } = req.body;
    
    // Aquí va tu lógica de Hugging Face...
    // (Asegúrate de que el fetch a Hugging Face esté bien configurado)

    return res.status(200).json({ reply: "skittles está procesando... :3" });

  } catch (error) {
    // Si algo falla, respondemos JSON, NUNCA HTML
    return res.status(200).json({ reply: "󱤆 error de glitch: el servidor está cansado u_u" });
  }
}
