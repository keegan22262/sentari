// /api/analyze-emotion.js
// Vercel Serverless Function — proxies the Anthropic API for the Emotion Check-In tool.
// This keeps your Anthropic API key on the server. NEVER call api.anthropic.com directly
// from browser JavaScript — that exposes your key to anyone who views page source.
//
// Setup:
// 1. In your Vercel project dashboard: Settings → Environment Variables
//    Add: ANTHROPIC_API_KEY = sk-ant-xxxxxxxx  (get this from console.anthropic.com)
// 2. Redeploy after adding the variable.

export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    const { text } = req.body || {};
  
    if (!text || typeof text !== 'string' || text.trim().length < 20) {
      return res.status(400).json({ error: 'Please provide at least a sentence or two.' });
    }
  
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Server is not configured with an API key yet.' });
    }
  
    const systemPrompt = `You are a compassionate emotion reflection assistant on a professional psychology website.
  Your role is to gently identify emotional themes in what someone has written and offer a warm, non-clinical reflection.
  
  IMPORTANT RULES:
  - You are NOT a therapist and must not diagnose, prescribe, or provide clinical advice
  - Always be warm, validating, and non-judgmental
  - If text suggests a crisis or suicidal ideation, ALWAYS set "crisis": true
  - Keep responses concise and supportive
  - Respond ONLY with valid JSON in this exact shape, no other text, no markdown fences:
  
  {
    "emotions": [
      {"label": "Emotion name", "percent": 0-100, "color": "olive|blush|stone|moss"},
      {"label": "Emotion name", "percent": 0-100, "color": "olive|blush|stone|moss"},
      {"label": "Emotion name", "percent": 0-100, "color": "olive|blush|stone|moss"}
    ],
    "reflection": "A 2-3 sentence warm, empathetic reflection on what they've shared. Written in second person, validating and human.",
    "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"],
    "crisis": false
  }
  
  Emotions should be specific (e.g. "Overwhelm", "Quiet sadness", "Anxious anticipation", "Grief", "Exhaustion", "Cautious hope") not generic.
  Percentages across all emotions should add to roughly 100.`;
  
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 800,
          system: systemPrompt,
          messages: [{ role: 'user', content: text }]
        })
      });
  
      if (!response.ok) {
        const errBody = await response.text();
        console.error('Anthropic API error:', errBody);
        return res.status(502).json({ error: 'Upstream API error' });
      }
  
      const data = await response.json();
      const raw = data.content?.[0]?.text || '';
      const cleaned = raw.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);
  
      return res.status(200).json(parsed);
  
    } catch (err) {
      console.error('analyze-emotion error:', err);
      return res.status(500).json({ error: 'Something went wrong analyzing the text.' });
    }
  }
  