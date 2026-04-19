export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const { message } = req.body;
    const token = process.env.HF_TOKEN?.trim();

    if (!token) return res.status(500).json({ reply: "no hay token en vercel! 🔑" });

    // URL SIN ESPACIOS, SIN SALTOS DE LÍNEA, LIMPIA:
    const url = "https://api-inference.huggingface.co/models/google/gemma-2-2b-it";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: message,
        parameters: { max_new_tokens: 100 }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ 
        reply: `glitch ${response.status}: ${errorText.slice(0, 50)}... ^_^` 
      });
    }

    const data = await response.json();
    const reply = Array.isArray(data) ? data[0]?.generated_text : data.generated_text;

    return res.status(200).json({ reply: (reply || "brain dead...").trim() });

  } catch (error) {
    return res.status(500).json({ reply: "mega brain error: " + error.message });
  }
}
