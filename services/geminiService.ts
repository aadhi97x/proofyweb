import { AnalysisResult, Verdict, TextAnalysisResult } from "../types.ts";

const extractJson = (text: string) => {
  try {
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").replace(/^[^{]*/, "").replace(/[^}]*$/, "").trim();
    return JSON.parse(cleanJson);
  } catch (e) {
    console.error("Failed to parse API response as JSON:", text);
    throw new Error("The forensic engine returned an unreadable response format.");
  }
};

const apiPost = async (endpoint: string, body: Record<string, unknown>) => {
  const res = await fetch(`/api/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    if (res.status === 413) {
      throw new Error("This file is too large to upload for analysis. Please try a smaller or compressed file.");
    }
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `API error ${res.status}`);
  }

  return res.json();
};

const fileToBase64 = (file: File | Blob): Promise<string> =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });

// Vercel serverless functions reject request bodies larger than 4.5 MB.
// base64 inflates payloads by ~33%, so we keep the raw bytes we send well
// under that ceiling to leave headroom for JSON overhead.
const MAX_RAW_BYTES = 3.2 * 1024 * 1024; // ~3.2 MB raw -> ~4.3 MB base64

/**
 * Downscale + re-encode an image via canvas so its base64 payload stays under
 * the serverless body limit. Tries progressively smaller dimensions/quality.
 */
const compressImage = (file: File): Promise<{ base64Data: string; mimeType: string }> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error("Could not process image."));

      const attempts = [
        { maxDim: 1600, quality: 0.85 },
        { maxDim: 1280, quality: 0.8 },
        { maxDim: 1024, quality: 0.75 },
        { maxDim: 800, quality: 0.7 }
      ];

      for (const { maxDim, quality } of attempts) {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        const base64Data = dataUrl.split(',')[1];
        // base64 length * 3/4 ≈ decoded byte size
        if ((base64Data.length * 3) / 4 <= MAX_RAW_BYTES) {
          return resolve({ base64Data, mimeType: 'image/jpeg' });
        }
      }
      reject(new Error("This image is too large to analyze even after compression. Please try a smaller one."));
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not read this image file."));
    };

    img.src = objectUrl;
  });

/**
 * Prepare any media file for upload: images are compressed to fit the body
 * limit; videos/audio are sent as-is but rejected up front if too large.
 */
const prepareMedia = async (file: File): Promise<{ base64Data: string; mimeType: string }> => {
  if (file.type.startsWith('image/')) {
    return compressImage(file);
  }

  if (file.size > MAX_RAW_BYTES) {
    const limitMb = (MAX_RAW_BYTES / (1024 * 1024)).toFixed(1);
    throw new Error(`This file is ${(file.size / (1024 * 1024)).toFixed(1)} MB. Videos and audio must be under ${limitMb} MB to analyze. Please trim or compress it first.`);
  }

  const base64Data = await fileToBase64(file);
  return { base64Data, mimeType: file.type };
};

export const generateForensicCertificate = async (result: AnalysisResult): Promise<string> => {
  const data = await apiPost('certificate', {
    id: result.id,
    verdict: result.verdict,
    deepfakeProbability: result.deepfakeProbability,
    explanations: result.explanations
  });
  return data.response || "Failed to generate text report.";
};

export const reverseSignalGrounding = async (file: File): Promise<any> => {
  const { base64Data, mimeType } = await prepareMedia(file);

  const data = await apiPost('reverse-ground', {
    base64Data,
    mimeType
  });

  const parsed = extractJson(data.response);
  return { ...parsed, sources: data.sources || [], isSafeMode: data.isSafeMode };
};

export const analyzeMedia = async (file: File, metadata: any): Promise<AnalysisResult> => {
  const isVideo = file.type.includes('video');
  const { base64Data, mimeType } = await prepareMedia(file);

  const data = await apiPost('analyze', {
    base64Data,
    mimeType,
    isVideo
  });

  const parsed = extractJson(data.response);

  let finalVerdict = Verdict.LIKELY_FAKE;
  const prob = parsed.deepfakeProbability ?? 50;

  if (prob < 50) {
    finalVerdict = Verdict.REAL;
  }

  return {
    id: Math.random().toString(36).substr(2, 9).toUpperCase(),
    timestamp: Date.now(),
    verdict: finalVerdict,
    confidence: parsed.confidence ?? 0,
    confidenceLevel: (parsed.confidence > 85 ? 'High' : parsed.confidence < 50 ? 'Low' : 'Medium') as any,
    deepfakeProbability: prob,
    summary: parsed.summary || "Forensic analysis complete.",
    userRecommendation: parsed.userRecommendation || "Verify manually.",
    analysisSteps: parsed.analysisSteps || {
      integrity: { score: 0, explanation: "Pending...", confidenceQualifier: "Medium" },
      consistency: { score: 0, explanation: "Pending...", confidenceQualifier: "Medium" },
      aiPatterns: { score: 0, explanation: "Pending...", confidenceQualifier: "Medium" },
      temporal: { score: 0, explanation: "Pending...", confidenceQualifier: "Medium" }
    },
    explanations: Array.isArray(parsed.explanations) ? parsed.explanations : [],
    manipulationType: parsed.manipulationType || (prob > 50 ? "Neural Synthesis" : "N/A"),
    guidance: parsed.guidance || "Caution advised.",
    fileMetadata: metadata,
    isSafeMode: data.isSafeMode
  };
};

export const analyzeText = async (text: string, mode: 'AI_DETECT' | 'FACT_CHECK'): Promise<TextAnalysisResult> => {
  const data = await apiPost('text-analyze', { text, mode });

  const parsed = extractJson(data.response);
  return {
    likelihoodRange: parsed.aiProbability ? `${parsed.aiProbability}%` : "0%",
    aiProbability: parsed.aiProbability ?? 0,
    verdictLabel: parsed.verdictLabel || "STRICT",
    ambiguityNote: "",
    aiSignals: parsed.aiSignals || [],
    humanSignals: parsed.humanSignals || [],
    isFactual: parsed.isFactual ?? 'STRICT',
    summary: parsed.summary || "Analysis complete.",
    claims: parsed.claims || [],
    linguisticMarkers: parsed.linguisticMarkers || [],
    sources: data.sources || [],
    isSafeMode: data.isSafeMode
  };
};

export const startAssistantChat = () => {
  const history: { role: string; parts: { text: string }[] }[] = [];

  return {
    sendMessage: async ({ message }: { message: string }) => {
      history.push({ role: 'user', parts: [{ text: message }] });

      const data = await apiPost('chat', { message, history });
      const responseText = data.response || "";

      history.push({ role: 'model', parts: [{ text: responseText }] });

      return {
        text: responseText,
        sources: data.sources || []
      };
    }
  };
};

export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  if (audioBlob.size > MAX_RAW_BYTES) {
    const limitMb = (MAX_RAW_BYTES / (1024 * 1024)).toFixed(1);
    throw new Error(`This audio clip is too large to transcribe (limit ${limitMb} MB). Please record or upload a shorter clip.`);
  }

  const base64Data = await fileToBase64(audioBlob);

  const data = await apiPost('transcribe', {
    base64Data,
    mimeType: audioBlob.type
  });

  return data.response || "";
};
