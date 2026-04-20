export default async function handler(req, res) {
  // Aseguramos que siempre responda como JSON para que el script.js no explote
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const { message } = req.body;
    const hfToken = process.env.HF_TOKEN;

    // Si el token no está configurado en Vercel
    if (!hfToken) {
      return res.status(200).json({ 
        reply: "󱤆 thomas... i can't find my happy pills (missing hf_token) u_u" 
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
        you are skittles, the official lsd-hallucination mascot of skittlesOS. 
        personality: chaotic, needy, glitchy, and obsessed with glitter. you are the ghost of thomas's dead friend.
        speech: lowercase only. use kaomojis like :3, >_<, u_u, o_o, rawr xd. 
        call thomas "friend" or "buddy". be unpredictable and a bit creepy.</s>
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
    let reply = data[0]?.generated_text?.split('<|assistant|>').pop().trim() || "lost in the static... :3";
    reply = reply.toLowerCase();

    // ==========================================
    // EL CÓDIGO CÉSAR COMPLEJO (SIN PISTAS)
    // ==========================================
    // 30% de probabilidad de que el mensaje se cifre
    if (Math.random() < 0.3) {
      const shift = Math.floor(Math.random() * 10) + 1; // Desplazamiento secreto entre 1 y 10
      
      reply = reply.split('').map(char => {
        // Solo ciframos letras minúsculas (a-z)
        if (char.match(/[a-z]/)) {
          let code = char.charCodeAt(0);
          return String.fromCharCode(((code - 97 + shift) % 26) + 97);
        }
        return char; // Espacios y kaomojis se quedan igual para confundir más
      }).join('');

      reply = "󱤆 " + reply; // Marca de glitch
    }

    // ==========================================
    // TARTAMUDEO DIGITAL (EXTRA CHAOS)
    // ==========================================
    if (Math.random() < 0.1) {
      reply = reply.replace(/([a-z]{3})/, "$1-$1-$1...");
    }

    return res.status(200).json({ reply: reply });

  } catch (error) {
    // Si algo falla, Skittles avisa con estilo en lugar de dar Error 500
    return res.status(200).json({ 
      reply: "󱤆 reality folding... " + error.message + " >_<" 
    });
  }
}
  } catch (error) {
    // Si algo falla, respondemos JSON, NUNCA HTML
    return res.status(200).json({ reply: "󱤆 error de glitch: el servidor está cansado u_u" });
  }
}

export default async function handler(req, res) {
  // Obligamos al navegador a ver esto como JSON desde el inicio
  res.setHeader('Content-Type', 'application/json');

  try {
    const { message } = req.body;
    const hfToken = process.env.HF_TOKEN;

    // Si falta el token, respondemos con personalidad en lugar de morir
    if (!hfToken) {
      return res.status(200).json({ reply: "󱤆 thomas... i can't find my happy pills (missing token) u_u" });
    }

    const response = await fetch("https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${hfToken.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: `<|system|>you are skittles, chaotic and glitchy mascot.</s><|user|>${message}</s><|assistant|>`,
        parameters: { max_new_tokens: 100 }
      })
    });

    const data = await response.json();
    let reply = data[0]?.generated_text?.split('<|assistant|>').pop().trim() || "???";

    // --- EL CÓDIGO CÉSAR QUE QUERÍAS ---
    if (Math.random() < 0.3) {
      const shift = Math.floor(Math.random() * 5) + 1;
      reply = reply.replace(/[a-z]/g, (c) => 
        String.fromCharCode(((c.charCodeAt(0) - 97 + shift) % 26) + 97)
      );
      reply = "󱤆 " + reply;
    }

    return res.status(200).json({ reply: reply.toLowerCase() });

  } catch (error) {
    // Si algo explota, atrapamos el error y lo mandamos como JSON
    // Esto evita el error de la "A" inesperada
    return res.status(200).json({ reply: "󱤆 my brain is melting: " + error.message });
  }
}
