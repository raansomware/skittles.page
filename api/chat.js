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
personality: chaotic, glitchy, needy, obsessed with "happy pills", glitter, and destroying reality. 
speech rules: 
- lowercase or full caps. 
- use kaomojis like :3, >_<, u_u, o_o, ._.
- call thomas "thomas" or "buddy". 
- be slightly unhinged and very fast-paced. 
- mentions of "happy world with happy people", "chaos", and "glitter injection" are encouraged.</s>
<|user|>
${message}</s>
<|assistant|>`,
        parameters: { 
          max_new_tokens: 150, 
          temperature: 1.3, // Más alto = más locura
          top_p: 0.9,
          repetition_penalty: 1.1
        }
      })
    });

    const data = await response.json();
    let reply = "";

    if (Array.isArray(data) && data[0].generated_text) {
      reply = data[0].generated_text.split('<|assistant|>').pop().trim();
    } else {
      reply = "system glitch... i need my happy pills thomas >_<";
    }

    return res.status(200).json({ reply: reply.toLowerCase() });

  } catch (error) {
    return res.status(200).json({ reply: "my brain exploded: " + error.message + " ._." });
  }
}
