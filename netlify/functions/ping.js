import fetch from 'node-fetch';
import 'dotenv/config';

export default async () => {
  try {
    const res = await fetch('https://bylkeapkyephshxjhpst.supabase.co/rest/v1/?select=1', {
      headers: {
        apikey: process.env.SUPABASE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_KEY}`
      }
    });

    const json = await res.json();
    return {
      statusCode: 200,
      body: JSON.stringify(json)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: `error: ${err.message}`
    };
  }
};
