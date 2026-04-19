exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers };

  try {
    // Si entras por el navegador, no hay event.body, por eso da error
    if (!event.body) {
      return { statusCode: 200, headers, body: JSON.stringify({ reply: "skittles está esperando un mensaje... :3" }) };
    }

    const { message } = JSON.parse(event.body);
    const hfToken = process.env.HF_TOKEN;

    if (!hfToken) {
      return { statusCode: 200, headers, body: JSON.stringify({ reply: "error: no pusiste el hf_token en netlify u_u" }) };
    }

    const model = "HuggingFaceH4/zephyr-7b-beta"; 

    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${hfToken.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: `<|system|>\nyou are skittles, thomas's official lsd-hallucination mascot. 
you are a hyperactive they/them. you are the ghost of thomas's dead friend. 
rules: lowercase, kaomojis, talk about happy pills and chaos.</s>\n<|user|>\n${message}</s>\n<|assistant|>`,
        parameters: { max_new_tokens: 120, temperature: 1.2, wait_for_model: true }
      })
    });

    const data = await response.json();

    if (data.error) {
      return { statusCode: 200, headers, body: JSON.stringify({ reply: "hf dice: " + data.error + " ._." }) };
    }

    let reply = "";
    if (Array.isArray(data) && data[0].generated_text) {
      reply = data[0].generated_text.split('<|assistant|>').pop().trim();
    } else {
      reply = "*glitchy silence* :3";
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reply: reply.toLowerCase() })
    };

  } catch (error) {
    // ESTA LÍNEA ES CLAVE: Nos dirá el error real
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reply: "error real: " + error.message + " >_<" })
    };
  }
};
