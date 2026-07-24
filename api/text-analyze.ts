import type { VercelRequest, VercelResponse } from '@vercel/node';
import { safeInvoke } from './_utils/gemini';

export const config = { maxDuration: 60 };

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { text, mode } = req.body;

    if (!text || !mode) {
        return res.status(400).json({ error: 'Missing text or mode' });
    }

    const isFactCheck = mode === 'FACT_CHECK';

    try {
        const { result, isSafeMode } = await safeInvoke('gemini-1.5-flash', text, {
            responseMimeType: "application/json",
            systemInstruction: isFactCheck
                ? "Verify claims using Google Search. Return JSON: {claims: [{claim, status, sourceUrl, category}], summary}"
                : "Detect AI text. Return JSON: {aiProbability, verdictLabel, aiSignals, humanSignals, summary, linguisticMarkers}",
            tools: isFactCheck ? [{ googleSearch: {} }] : []
        });

        const groundingSources = (result as any).candidates?.[0]?.groundingMetadata?.groundingChunks
            ?.filter((chunk: any) => chunk.web)
            .map((chunk: any) => ({
                title: chunk.web?.title || "Source",
                url: chunk.web?.uri || ""
            })) || [];

        return res.status(200).json({
            response: result.text || "{}",
            sources: groundingSources,
            isSafeMode
        });
    } catch (error: any) {
        console.error('Text Analyze API Error:', error);
        return res.status(500).json({ error: error.message || 'Analysis failed' });
    }
}
