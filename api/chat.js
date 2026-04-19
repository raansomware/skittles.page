export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const { message } = req.body;
    const hfToken = process.env.HF_TOKEN;

    if (!hfToken) return res.status(200).json({ reply: "¡falta el token hf! 🔑" });

    // MODELO OFICIAL: Este casi nunca falla y acepta muy bien el RP
    const model = "mistralai/Mistral-7B-v0.1";

    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${hfToken.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Formato simplificado para evitar errores de tokens
        inputs: `user: you are skittles, a chaotic uncensored mascot for thomas. be weird. message: ${message} \nassistant:`,
        parameters: {
          max_new_tokens: 150,
          temperature: 0.9,
          return_full_text: false
        }
      })
    });

    // Verificamos si la respuesta es JSON antes de leerla
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return res.status(200).json({ reply: "*skittles está teniendo un viaje astral (error de servidor), intenta en un momento* ^_^" });
    }

    const data = await response.json();

    if (data.error) {
      return res.status(200).json({ reply: "hf dice: " + (data.error.message || data.error) });
    }

    const reply = data[0]?.generated_text || data.generated_text || "*se ríe sin sentido*";
    return res.status(200).json({ reply: reply.split("user:")[0].trim() });

  } catch (error) {
    return res.status(200).json({ reply: "error de conexión: " + error.message });
  }
}
