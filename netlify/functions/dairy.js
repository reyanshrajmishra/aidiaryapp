export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    };
  }

  const { text, date } = JSON.parse(event.body || '{}');

  if (!text || !date) {
    return {
      statusCode: 400,
      body: 'Missing text or date'
    };
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer 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}`
      },
      body: JSON.stringify({
        model: "mistralai/mixtral-8x7b-instruct",
        messages: [{
          role: "user",
          content: `Hey My Name Is Reyansh Raj Mishra and you are integrated in my app for helping me write diary entries. The date is ${date}. Today I: ${text}`
        }]
      })
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: `OpenRouter error ${response.status}`
      };
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ entry: content })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: `Server error: ${err.message}`
    };
  }
}
