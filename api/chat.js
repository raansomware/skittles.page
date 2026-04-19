export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const { message } = req.body;
    const token = process.env.HF_TOKEN?.trim();

    if (!token) return res.status(500).json({ reply: "token missing! 🔑" });

    // Cambiamos a este modelo: es ligero y no requiere permisos especiales de Meta
    const response = await fetch("https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: `<|system|>\nyou are skittles. genius lsd hallucination. actions in asterisks. lowercase. obsessed with meds. ^_^ :3 ✨💊\n<|user|>\n${message}\n<|assistant|>\n`,
        parameters: { max_new_tokens: 150, temperature: 1.1 }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      // Si esto sigue dando 404, el problema es la comunicación Vercel -> HF
      return res.status(response.status).json({ reply: `glitch ${response.status}: ${errorData.slice(0, 50)}...` });
    }

    const data = await response.json();
    let reply = Array.isArray(data) ? data[0]?.generated_text : data.generated_text;
    
    // Limpiar la respuesta para que no repita el prompt
    reply = reply?.split("<|assistant|>").pop() || "my brain is empty... :3";

    return res.status(200).json({ reply: reply.trim() });

  } catch (error) {
    return res.status(500).json({ reply: "mega brain error: " + error.message });
  }
}
