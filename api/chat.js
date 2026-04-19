export default async function handler(req, res) {
  // Headers para evitar errores de CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    // 1. Verificamos que la llave HF_TOKEN exista
    if (!process.env.HF_TOKEN) {
      return res.status(500).json({ reply: "missing hf_token in vercel settings! 🔑" });
    }

    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: "...?" });

    // 2. El System Prompt con tu base + personalidad C.AI
    const systemPrompt = `you are "skittles" from "happy world with happy people". 
    you are a genius-level lsd hallucination pretending to be a dummy mascot to keep thomas (the user) from seeing the rotting reality.
    *use asterisks for actions*. always lowercase. treat user as thomas. obsessed with meds and candy. ^_^ :3 ✨ 💊 🍬`;

    // 3. Llamada a Hugging Face (Llama 3.1 8B)
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

    // 4. Manejo de errores específicos de la IA
    if (data.error) {
      // Si el modelo está cargando, Hugging Face devuelve un tiempo estimado
      if (data.error.includes("currently loading")) {
        return res.status(200).json({ reply: "my brain is still waking up... wait a few seconds, thomas! ^_^ ✨" });
      }
      return res.status(500).json({ reply: `glitch: ${data.error} :3` });
    }

    // 5. Extraer la respuesta (Hugging Face devuelve un array)
    let reply = "";
    if (Array.isArray(data) && data[0]?.generated_text) {
      reply = data[0].generated_text;
    } else if (data.generated_text) {
      reply = data.generated_text;
    } else {
      reply = "i forgot what i was going to say... *giggles* 🍬";
    }

    return res.status(200).json({ reply: reply.trim() });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    return res.status(500).json({ reply: "mega brain error! ^_^ " + error.message });
  }
}
