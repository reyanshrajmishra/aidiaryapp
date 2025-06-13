// netlify/functions/diary.js
export async function handler(event) {
  const { text, date } = JSON.parse(event.body || '{}');

  const apiKey = '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'; // Replace with your actual key

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://aidiaryapp.netlify.app'
    },
    body: JSON.stringify({
      model: 'mistralai/mixtral-8x7b',
      messages: [
        { role: 'system', content: 'You are an AI diary writer.' },
        { role: 'user', content: `Write a diary entry based on this: "${text}" on ${date}` }
      ]
    })
  });

  if (!response.ok) {
    return {
      statusCode: response.status,
      body: JSON.stringify({ error: 'API error occurred.' })
    };
  }

  const data = await response.json();
  const entry = data.choices?.[0]?.message?.content || 'Entry could not be generated.';

  return {
    statusCode: 200,
    body: JSON.stringify({ entry })
  };
}
