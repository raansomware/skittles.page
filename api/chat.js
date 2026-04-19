export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    if (!process.env.HF_TOKEN) {
      return res.status(500).json({ reply: "missing hf_token! 🔑" });
    }

    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: "...?" });

    const systemPrompt = `you are "skittles" from "happy world with happy people". 
    genius lsd hallucination pretending to be a dummy mascot. *actions*. lowercase. treat user as thomas. obsessed with meds and candy. ^_^ :3 ✨ 💊 🍬`;

    const response = await fetch("https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3.1-8B-Instruct", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HF_TOKEN.trim()}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: `<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n${systemPrompt}<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n${message}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n`,
        parameters: { max_new_tokens: 150, temperature: 1.1, return_full_text: false }
      })
    });

    // LEER COMO TEXTO PRIMERO PARA EVITAR EL ERROR DEL "<"
    const responseText = await response.text();
    
    let data;
    try {
        data = JSON.parse(responseText);
    } catch (e) {
        return res.status(500).json({ reply: "hf returned html instead of json... check your token! 🍬" });
    }

    if (data.error) {
      if (data.error.includes("currently loading")) {
        return res.status(200).json({ reply: "my brain is still waking up... wait 20s, thomas! ^_^" });
      }
      return res.status(500).json({ reply: `glitch: ${data.error} :3` });
    }

    const reply = Array.isArray(data) ? data[0]?.generated_text : data.generated_text;
    return res.status(200).json({ reply: (reply || "i'm lost...").trim() });

  } catch (error) {
    return res.status(500).json({ reply: "mega brain error: " + error.message });
  }
}
