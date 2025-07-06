import fetch from 'node-fetch';
import 'dotenv/config';

export default async (req) => {
  try {
    const url = 'https://bylkeapkyephshxjhpst.supabase.co/rest/v1/?select=1';
    const apiKey = process.env.SUPABASE_KEY;

    const res = await fetch(url, {
      headers: {
        'apikey': apiKey,
        'Authorization': `Bearer ${apiKey}`
      }
    });

    const text = await res.text();

    return {
      statusCode: 200,
      body: `✅ Supabase response:\n${text}`
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: `❌ Error: ${err.message || err}`
    };
  }
};
