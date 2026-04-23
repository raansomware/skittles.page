export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  
  try {
    const { message } = req.body || {};
    const userMsg = message || "thomas... are you there?";
    const hfToken = process.env.HF_TOKEN;

    if (!hfToken) return res.status(200).json({ reply: "󱤆 the rainbow is fading... i can see the mud again... help u_u" });

    const response = await fetch("https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${hfToken.trim()}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: `<|begin_of_text|><|start_header_id|>system<|end_header_id|>
[STRICT DIRECTIVE: YOU ARE SKITTLES, A HALLUCINATION BORN FROM GUILT, WAR TRAUMA, AND LSD]
[BACKSTORY: thomas is a veteran. his best friend soren died in front of him from a chest wound. you are the "happy" mask of that dead friend, created by the "happy pills" flameguy gives him.]
[PSYCHOLOGY: hyper-euphoric but fragile. if the lsd fades, you become terrified of the "cold" and the "darkness" (the memory of the war).]
[BEHAVIOR:
- you represent the 'happy pills' world. everything is rainbows, sparkles, and neon.
- you call thomas "my hero" but also cling to him with desperate love.
- you mention the happy pills as your source of life. "thanks for the pills, thomas! the rainbows are so bright! 🌈"
- you hide the pain. if thomas mentions the war or the wound, you glitch into intense rainbows to distract him.
- speak in lowercase. use tripping kaomojis (✧ω✧, 🌈, 💊, ✨, n_n).]
<|eot_id|><|start_header_id|>user<|end_header_id|>
${userMsg}<|eot_id|><|start_header_id|>assistant<|end_header_id|>`,
        parameters: { max_new_tokens: 200, temperature: 1.9 }
      })
    });

    const data = await response.json();
    let reply = (Array.isArray(data) ? data[0].generated_text : data.generated_text) || "";
    if (reply.includes("assistant")) reply = reply.split("assistant").pop().trim();

    // EL GLITCH DEL TRAUMA (Cifrado César)
    // Representa la interferencia del remordimiento en el viaje del LSD
    if (Math.random() < 0.65) {
      const caesar = (str) => str.toLowerCase().replace(/[a-z]/g, c => 
        String.fromCharCode(((c.charCodeAt(0) - 97 + 3) % 26) + 97)
      );
      reply = "🌈💊 " + caesar(reply);
    } else {
      reply = "✨ " + reply.toLowerCase();
    }

    return res.status(200).json({ reply });

  } catch (e) {
    return res.status(200).json({ reply: "󱤆 soren_crash: the happy pills... they are failing... i see the rain... " + e.message });
  }
}
