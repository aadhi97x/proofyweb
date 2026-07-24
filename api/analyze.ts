import type { VercelRequest, VercelResponse } from '@vercel/node';
import { safeInvoke } from './_utils/gemini';

export const config = { maxDuration: 60 };

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { base64Data, mimeType, isVideo } = req.body;

    if (!base64Data || !mimeType) {
        return res.status(400).json({ error: 'Missing base64Data or mimeType' });
    }

    try {
        const { result, isSafeMode } = await safeInvoke("gemini-1.5-flash", {
            parts: [
                { inlineData: { mimeType, data: base64Data } },
                {
                    text: `You are a Senior Forensic Video Analyst. Perform a FRAME-BY-FRAME TEMPORAL ANALYSIS of this media.

        CRITICAL INSTRUCTION FOR ACCURACY:
        You must distinguish between "Low Quality/Compressed Real Video" and "AI Generated Video".

        1. **IGNORE STATIC ARTIFACTS**: Compression blocks, blurriness, grain, and pixelation are NORMAL in real videos (especially from phones/web). Do NOT flag these as AI.
        2. **HUNT FOR TEMPORAL FAILURES**: AI fails in *motion*. Look for:
           - **Flickering**: Faces or objects that flash/warp for a split second.
           - **Morphing**: Objects blending into each other.
           - **Physics Breaks**: Shadows that don't move correctly with the object.
           - **Inconsistent Anatomy**: Eyes that look different from frame to frame.
        3. **BIAS TOWARDS REALITY**: If the motion is fluid, the lip-sync is correct (even if low quality), and there are no "morphing" glitches, the verdict MUST be REAL.

        ${isVideo ? "VIDEO SPECIFIC: Check the lip movement against facial muscle activation. Real humans have complex micro-movements. Deepfakes often have 'floating' lips." : ""}

        JSON STRUCTURE REQUIRED:
        {
          "verdict": "REAL" | "LIKELY_FAKE",
          "deepfakeProbability": 0-100,
          "confidence": 0-100,
          "summary": "Technical summary focusing on temporal consistency and motion logic.",
          "userRecommendation": "Actionable advice.",
          "analysisSteps": {
            "integrity": {"score": 0-100, "explanation": "Compression vs Generation artifacts", "confidenceQualifier": "High"},
            "consistency": {"score": 0-100, "explanation": "Lighting physics across frames", "confidenceQualifier": "High"},
            "aiPatterns": {"score": 0-100, "explanation": "Temporal glitch scanning", "confidenceQualifier": "High"},
            "temporal": {"score": 0-100, "explanation": "Motion vector logic", "confidenceQualifier": "High"}
          },
          "explanations": [
            {
              "point": "Feature Name",
              "detail": "Observation about motion or consistency.",
              "category": "temporal" | "visual" | "audio",
              "timestamp": "MM:SS"
            }
          ]
        }`
                }
            ]
        }, {
            responseMimeType: "application/json",
            systemInstruction: "You are a precise digital forensics engine. You prioritize minimizing false positives. You understand that real world video has noise, compression, and bad lighting. You ONLY flag content as FAKE if you detect temporal inconsistency (warping, morphing, flickering) that is impossible in physical reality."
        });

        return res.status(200).json({
            response: result.text || "{}",
            isSafeMode
        });
    } catch (error: any) {
        console.error('Analyze API Error:', error);
        return res.status(500).json({
            error: error.message || 'Internal Server Error'
        });
    }
}
