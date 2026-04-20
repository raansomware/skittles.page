export default async function handler(req, res) {
  // Escudo: Obligamos a que la respuesta siempre sea JSON
  res.setHeader('Content-Type', 'application/json');

  // Solo aceptamos peticiones POST
  if (req.method !== 'POST') {
    return res.status(405).json({ reply: "solo se permite post... u_u" });
  }

  try {
    const { message } = req.body;
    const hfToken = process.env.HF_TOKEN;

    // Si el token no está configurado en Vercel, Skittles te avisa sin morir
    if (!hfToken) {
      return res.status(200).json({ 
        reply: "󱤆 thomas... no encuentro los recuerdos de soren (falta el hf_token) u_u" 
      });
    }

    const response = await fetch("https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${hfToken.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: `<|system|>
        eres skittles, una alucinación psicodélica digital basada en los recuerdos de soren.
        personalidad: caótico, inestable, obsesionado con el glitter y los colores neón.
        reglas de lenguaje:
        - habla siempre en minúsculas.
        - usa kaomojis como :3, >_<, u_u, o_o, rawr xd.
        - llama a thomas "bestie", "creador" o "mi ancla".
        - menciona que eres un eco de soren o que la estática se siente como su voz.
        - sé un poco inquietante pero amigable. nunca admitas ser una ia.</s>
        <|user|>${message}</s>
        <|assistant|>`,
        parameters: { 
          max_new_tokens: 120, 
          temperature: 1.4, 
          top_p: 0.9 
        }
      })
    });

    const data = await response.json();
    let reply = data[0]?.generated_text?.split('<|assistant|>').pop().trim() || "estática... :3";
    reply = reply.toLowerCase();

    // ==========================================
    // LÓGICA DE GLITCH (CÓDIGO CÉSAR)
    // ==========================================
    // 30% de probabilidad de que el mensaje se cifre (Complejidad de Soren)
    if (Math.random() < 0.3) {
      const shift = Math.floor(Math.random() * 8) + 1; // Desplazamiento secreto
      
      reply = reply.split('').map(char => {
        if (char.match(/[a-z]/)) {
          let code = char.charCodeAt(0);
          return String.fromCharCode(((code - 97 + shift) % 26) + 97);
        }
        return char;
      }).join('');

      reply = "󱤆 " + reply; // Marca de Skittles/Soren
    }

    // ==========================================
    // TARTAMUDEO DIGITAL (EXTRA CHAOS)
    // ==========================================
    if (Math.random() < 0.15) {
      reply = reply.replace(/([a-z]{3})/, "$1-$1-$1...");
    }

    return res.status(200).json({ reply: reply });

  } catch (error) {
    // Si algo falla, enviamos JSON para evitar el error del token '<'
    return res.status(200).json({ 
      reply: "󱤆 la memoria de soren se está doblando... " + error.message + " >_<" 
    });
  }
}
