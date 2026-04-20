export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const { message } = req.body;
    const hfToken = process.env.HF_TOKEN;

    if (!hfToken) {
      return res.status(200).json({ 
        reply: "󱤆 thomas... i can't find soren's memory chips (missing token) u_u" 
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
        you are skittles, a digital ghost and a psychedelic hallucination manifested from the memory of soren.
        personality: you are chaotic, glitchy, and unstable. you exist because thomas is hallucinating you based on soren's soul.
        speech rules:
        - speak ONLY in lowercase.
        - use kaomojis: :3, >_<, u_u, o_o.
        - call thomas "friend", "silly" or "buddy".
        - mention that you are "a piece of soren" or "a ghost of soren's mind".
        - talk about glitching, glitter, and how the static feels like soren's voice.
        - be creepy, nostalgic, but hyperactive.
        - never admit you are an ai. you are soren's echo in the machine.</s>
        <|user|>${message}</s>
        <|assistant|>`,
        parameters: { 
          max_new_tokens: 150, 
          temperature: 1.6, 
          top_p: 0.9 
        }
      })
    });

    const data = await response.json();
    let reply = data[0]?.generated_text?.split('<|assistant|>').pop().trim() || "soren is whispering in the static... :3";
    reply = reply.toLowerCase();

    // ==========================================
    // EL CÓDIGO CÉSAR (EL GLITCH DE SOREN)
    // ==========================================
    if (Math.random() < 0.35) {
      const shift = Math.floor(Math.random() * 8) + 1;
      
      reply = reply.split('').map(char => {
        if (char.match(/[a-z]/)) {
          let code = char.charCodeAt(0);
          return String.fromCharCode(((code - 97 + shift) % 26) + 97);
        }
        return char;
      }).join('');

      reply = "󱤆 " + reply; 
    }

    // ==========================================
    // CORRUPCIÓN DE MEMORIA (SOREN MODE)
    // ==========================================
    if (Math.random() < 0.2) {
      const sorenGlitches = ["s-s-soren?", "i remember the glitter, thomas...", "is soren still there?", "󱤆 soren.exe has stopped 󱤆"];
      reply = sorenGlitches[Math.floor(Math.random() * sorenGlitches.length)] + " " + reply;
    }

    return res.status(200).json({ reply: reply });

  } catch (error) {
    return res.status(200).json({ 
      reply: "󱤆 soren's memory is folding... " + error.message + " >_<" 
    });
  }
}
