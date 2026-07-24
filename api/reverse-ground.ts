import type { VercelRequest, VercelResponse } from '@vercel/node';
import { safeInvoke } from './_utils/gemini';

export const config = { maxDuration: 60 };

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { base64Data, mimeType } = req.body;

    if (!base64Data || !mimeType) {
        return res.status(400).json({ error: 'Missing base64Data or mimeType' });
    }

    try {
        const { result, isSafeMode } = await safeInvoke("gemini-1.5-flash", {
            parts: [
                { inlineData: { mimeType, data: base64Data } },
                { text: "Locate the primary source of this image using Google Search. Return JSON: {summary, originalEvent, manipulationDetected, confidence, findings: [{type, detail}]}" }
            ]
        }, {
            responseMimeType: "application/json",
            tools: [{ googleSearch: {} }]
        });

        const sources = (result as any).candidates?.[0]?.groundingMetadata?.groundingChunks
            ?.filter((chunk: any) => chunk.web)
            .map((chunk: any) => ({ title: chunk.web?.title || "Verified Source", url: chunk.web?.uri || "" })) || [];

        return res.status(200).json({
            response: result.text || "{}",
            sources,
            isSafeMode
        });
    } catch (error: any) {
        console.error('Reverse Grounding API Error:', error);
        return res.status(500).json({ error: error.message || 'Reverse grounding failed' });
    }
}
