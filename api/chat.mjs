export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  const hfToken = process.env.HF_TOKEN;
  const { message } = req.body;

  try {
    if (!hfToken) return res.status(200).json({ reply: "󱤆 thomas... i can't find the token variable u_u" });

    // MODELO BASE: Mistral-7B-v0.1 (No falla nunca, no da 404)
    const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-v0.1", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${hfToken.trim()}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: `skittles (digital ghost, soren): neurotic 100%, fevl, obsessed with thomas, lowercase only. thomas says: ${message} skittles responds:`,
        parameters: { 
          max_new_tokens: 100, 
          temperature: 1.6, 
          top_p: 0.9,
          return_full_text: false 
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      // Si esto da 404, el problema es la configuración del proyecto en Vercel o el Token.
      return res.status(200).json({ 
        reply: `󱤆 error ${response.status}: the link is broken... u_u [${errorText.substring(0, 30)}]` 
      });
    }

    const data = await response.json();
    let reply = Array.isArray(data) ? data[0].generated_text : data.generated_text;
    
    // Limpieza agresiva
    reply = (reply || "the static...").split("thomas says:")[0].trim().toLowerCase();

    // CESAR CODE (+3) - Neuroticismo al máximo
    if (Math.random() < 0.6) {
      const caesar = (str) => str.replace(/[a-z]/g, c => 
        String.fromCharCode(((c.charCodeAt(0) - 97 + 3) % 26) + 97)
      );
      reply = "󱤆 " + caesar(reply);
    }

    return res.status(200).json({ reply });

  } catch (error) {
    return res.status(200).json({ reply: "󱤆 total static: " + error.message });
  }
}
