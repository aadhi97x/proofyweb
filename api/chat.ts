import type { VercelRequest, VercelResponse } from '@vercel/node';
import { safeInvoke } from './_utils/gemini';

export const config = { maxDuration: 60 };

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { message, history } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Missing message' });
    }

    try {
        const { result } = await safeInvoke("gemini-2.5-flash", message, {
            systemInstruction: "You are a world-class forensic assistant. You help users understand deepfake detection, text analysis, and source verification. Use Google Search for up-to-date facts.",
            tools: [{ googleSearch: {} }],
            history: history || []
        });

        const sources = (result as any).candidates?.[0]?.groundingMetadata?.groundingChunks
            ?.filter((chunk: any) => chunk.web)
            .map((chunk: any) => ({
                title: chunk.web?.title || "Verified Source",
                url: chunk.web?.uri || ""
            })) || [];

        return res.status(200).json({
            response: result.text || "",
            sources
        });
    } catch (error: any) {
        console.error('Chat API Error:', error);
        return res.status(500).json({ error: error.message || 'Chat failed' });
    }
}
