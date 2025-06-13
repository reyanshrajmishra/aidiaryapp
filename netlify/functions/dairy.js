export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const { text, date } = req.body;

  if (!text || !date) {
    return res.status(400).json({ error: 'Missing input text or date' });
  }

  try {
    const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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' // Keep this private
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
      return res.status(openRouterRes.status).json({ error: err });
    }

    const data = await openRouterRes.json();
    const entry = data.choices[0].message.content;
    return res.status(200).json({ entry });
  } catch (err) {
    console.error('OpenRouter error:', err);
    return res.status(500).json({ error: 'Internal error generating diary entry.' });
  }
};
