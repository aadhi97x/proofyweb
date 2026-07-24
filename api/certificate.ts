import type { VercelRequest, VercelResponse } from '@vercel/node';
import { safeInvoke } from './_utils/gemini';

export const config = { maxDuration: 60 };

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { id, verdict, deepfakeProbability, explanations } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'Missing result data' });
    }

    try {
        const { result } = await safeInvoke("gemini-1.5-flash",
            `Generate a detailed forensic certificate for Case ID ${id}.
    Verdict: ${verdict}.
    AI Probability: ${deepfakeProbability}%.
    Include detailed findings: ${JSON.stringify(explanations)}.
    Format with professional headers and ASCII borders.`
        );

        return res.status(200).json({
            response: result.text || "Failed to generate certificate."
        });
    } catch (error: any) {
        console.error('Certificate API Error:', error);
        return res.status(500).json({ error: error.message || 'Certificate generation failed' });
    }
}
