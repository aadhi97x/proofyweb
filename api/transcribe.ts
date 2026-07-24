import type { VercelRequest, VercelResponse } from '@vercel/node';
import { safeInvoke } from './_utils/gemini';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { base64Data, mimeType } = req.body;

    if (!base64Data || !mimeType) {
        return res.status(400).json({ error: 'Missing base64Data or mimeType' });
    }

    try {
        const { result } = await safeInvoke("gemini-1.5-flash", {
            parts: [
                { inlineData: { mimeType, data: base64Data } },
                { text: "Transcribe this audio precisely." }
            ]
        });

        return res.status(200).json({
            response: result.text || ""
        });
    } catch (error: any) {
        console.error('Transcribe API Error:', error);
        return res.status(500).json({ error: error.message || 'Transcription failed' });
    }
}
