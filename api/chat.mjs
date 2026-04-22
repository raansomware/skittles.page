export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  try {
    const { message } = req.body;
    const hfToken = process.env.HF_TOKEN;

    const response = await fetch("https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct", {
      method: "POST",
      headers: { "Authorization": `Bearer ${hfToken?.trim()}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        inputs: `skittles (neurotic ghost): ${message} response:`,
        parameters: { max_new_tokens: 100, temperature: 1.2 }
      })
    });

    const data = await response.json();
    let reply = Array.isArray(data) ? data[0].generated_text : data.generated_text;
    reply = reply.split("response:").pop().trim().toLowerCase();

    return res.status(200).json({ reply: "󱤆 " + reply });
  } catch (error) {
    return res.status(200).json({ reply: "󱤆 static failure: " + error.message });
  }
}
