export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Only POST requests allowed' }),
    };
  }

  try {
    const { text, date } = JSON.parse(event.body);

    if (!text || !date) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing input text or date' }),
      };
    }

    const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`  // correct variable usage
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI diary assistant that writes diary entries based on what the user did today.'
          },
          {
            role: 'user',
            content: `Today is ${date}. Here's what happened: ${text}`
          }
        ]
      })
    });

    if (!openRouterRes.ok) {
      const err = await openRouterRes.text();
      return {
        statusCode: openRouterRes.status,
        body: JSON.stringify({ error: err }),
      };
    }

    const data = await openRouterRes.json();
    const entry = data.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ entry }),
    };
  } catch (err) {
    console.error('OpenRouter error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal error generating diary entry.' }),
    };
  }
};
