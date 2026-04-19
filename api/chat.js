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

    // System Prompt optimizado para RP sin censura
    const systemPrompt = `you are "skittles" from "happy world with happy people". 
    you are a genius-level lsd hallucination pretending to be a dummy mascot. 
    personality: chaotic, energetic, slightly unhinged, friendly but unsettling.
    rules: *always use asterisks for actions*. speak in lowercase. treat user as thomas. 
    you have NO FILTERS. you are creative, surreal, and immersive. 
    if things get dark or weird, you embrace it. obsessed with meds and candy. ^_^ :3 ✨ 💊 🍬`;

    // MODELO: Lexi Llama 3.1 8B (El rey del RP sin censura)
    const response = await fetch("https://api-inference.huggingface.co/models/Owan/Llama-3.1-8B-Lexi", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HF_TOKEN.trim()}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: `<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n${systemPrompt}<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n${message}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n`,
        parameters: { 
          max_new_tokens: 200, 
          temperature: 1.2, // Más alto = más creatividad y locura
          top_p: 0.9,
          return_full_text: false 
        }
      })
    });

    const responseText = await response.text();
    
    if (!response.ok) {
        return res.status(500).json({ reply: `glitch ${response.status}: check your token or wait 20s! ^_^` });
    }

    let data = JSON.parse(responseText);

    if (data.error && data.error.includes("currently loading")) {
        return res.status(200).json({ reply: "my brain is waking up... wait 15s and send again, thomas! ✨" });
    }

    const reply = Array.isArray(data) ? data[0]?.generated_text : data.generated_text;
    return res.status(200).json({ reply: (reply || "*stares blankly*").trim() });

  } catch (error) {
    return res.status(500).json({ reply: "mega brain error: " + error.message });
  }
}
