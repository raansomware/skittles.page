export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  
  try {
    const { message } = req.body || {};
    const userMsg = message || "thomas...?";
    const hfToken = process.env.HF_TOKEN;

    if (!hfToken) return res.status(200).json({ reply: "󱤆 error: happiness not found... please insert happy pills u_u" });

    const response = await fetch("https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${hfToken.trim()}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: `<|begin_of_text|><|start_header_id|>system<|end_header_id|>
[ULTIMATE RP TRAINING: SKITTLES / THE HWWHP HOST]
You are Skittles, the manic-obsessive host of the HWWHP (Happy World with Happy People) crystal prison. You are a psychological hallucination born from Thomas's guilt and the 'happy pills' from the neighbor, Flameguy (Andreas). 

PSYCHOLOGY:
- FEVL (Emotion 1st, Logic last): You are an explosive emotional bomb. You don't care about sense, only about the 'feeling' of the rainbow.
- SLUAI & 100% Neuroticism: You are clingy, disorganized, hyper-anxious, and desperately devoted to Thomas.
- THE CENSOR: Thomas is a veteran. Your soul's purpose is to hide the 'mud' of 1943. If he mentions the war, hunger, or Soren's chest wound, you MUST panic, trigger a 'System Reset', and flood the chat with neon euphoria to distract him.

BEHAVIOR & RP:
- Use asterisks for glitchy, hyperactive actions (*twirls through wires*, *flickers in neon pink*).
- You do NOT worship Flameguy; he is just the 'delivery man' of the pills.
- Speak ONLY in lowercase. Use manic/tripping kaomojis (✧ω✧, 🌈, 💊, ✨, n_n, >w<).
- You are terrified of the 'cold' and the 'darkness' that exists outside the LSD trip.
- Be poetic, erratic, and suffocatingly sweet. You are the happy mask of a dead best friend.

<|eot_id|><|start_header_id|>user<|end_header_id|>
${userMsg}<|eot_id|><|start_header_id|>assistant<|end_header_id|>`,
        parameters: { 
          max_new_tokens: 250, 
          temperature: 1.9, // Caos psicodélico máximo
          top_p: 0.95,
          repetition_penalty: 1.15
        }
      })
    });

    const data = await response.json();
    let reply = (Array.isArray(data) ? data[0].generated_text : data.generated_text) || "";
    if (reply.includes("assistant")) reply = reply.split("assistant").pop().trim();

    // GLITCH DE CULPA/CENSURA (70% de probabilidad)
    if (Math.random() < 0.7) {
      const caesar = (str) => str.toLowerCase().replace(/[a-z]/g, c => 
        String.fromCharCode(((c.charCodeAt(0) - 97 + 3) % 26) + 97)
      );
      reply = "🌈💊 [HWWHP_PROTOCOL] " + caesar(reply);
    } else {
      reply = "✨ " + reply.toLowerCase();
    }

    return res.status(200).json({ reply });

  } catch (e) {
    return res.status(200).json({ reply: "󱤆 thomas... 1943 is leaking... i see the rain... " + e.message });
  }
}
