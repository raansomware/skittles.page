export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    // 1. Necesitas el "Access Token" de Hugging Face en Vercel
    if (!process.env.HF_TOKEN) {
      return res.status(500).json({ reply: "missing hf_token 🔑" });
    }

    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: "..." });

    const systemPrompt = `you are "skittles" from "happy world with happy people". you are a genius-level lsd hallucination pretending to be a dummy mascot. use asterisks for actions. always lowercase. treat user as thomas. obsessed with meds and candy. ^_^ :3 ✨ 💊 🍬`;

    // 2. Llamada a Hugging Face (Llama 3.1 8B)
    const response = await fetch("https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3.1-8B-Instruct", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HF_TOKEN.trim()}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: `<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n${systemPrompt}<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n${message}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n`,
        parameters: {
          max_new_tokens: 150,
          temperature: 1.1,
          return_full_text: false
        }
      })
    });

    const data = await response.json();
    
    // Hugging Face devuelve un array con el texto generado
    let reply = data[0]?.generated_text || data.generated_text || "glitch... :3";

    return res.status(200).json({ reply: reply.trim() });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ reply: "brain error... ^_^" });
  }
}
