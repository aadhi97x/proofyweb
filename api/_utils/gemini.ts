import { GoogleGenAI } from "@google/genai";

class KeyManager {
    private static keys: string[] = (process.env.GEMINI_KEYS || process.env.GEMINI_API_KEY || "").split(',').filter(k => k.trim());
    private static currentIndex = 0;

    static getCurrentKey() {
        return this.keys[this.currentIndex];
    }

    static rotate() {
        if (this.keys.length > 1) {
            this.currentIndex = (this.currentIndex + 1) % this.keys.length;
            console.warn(`Rotating to API Key Index: ${this.currentIndex}`);
            return true;
        }
        return false;
    }

    static getKeyCount() {
        return this.keys.length;
    }
}

const getAI = () => {
    const apiKey = KeyManager.getCurrentKey();
    if (!apiKey) {
        throw new Error("API_KEY_MISSING: No Gemini API key configured on the server.");
    }
    return new GoogleGenAI({ apiKey });
};

export const safeInvoke = async (primaryModel: string, contents: any, config: any = {}) => {
    let attempts = 0;
    const maxAttempts = KeyManager.getKeyCount();
    const fallbackModel = "gemini-flash-latest";

    while (attempts < maxAttempts) {
        const ai = getAI();
        try {
            // Older flash aliases (incl. the now-retired gemini-2.5-flash) are
            // mapped to the current stable flash model to avoid wasted 404 calls.
            const retiredModels = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-2.5-flash"];
            const modelToUse = retiredModels.includes(primaryModel)
                ? "gemini-flash-latest"
                : primaryModel;

            const result = await ai.models.generateContent({
                model: modelToUse,
                contents,
                config
            });

            return { result, isSafeMode: false };
        } catch (err: any) {
            const errorMsg = (err.message || "").toLowerCase() + JSON.stringify(err).toLowerCase();

            const isQuotaOrNetworkError =
                errorMsg.includes("429") ||
                errorMsg.includes("quota") ||
                errorMsg.includes("exhausted") ||
                errorMsg.includes("limit reached") ||
                errorMsg.includes("system busy") ||
                errorMsg.includes("cooling down") ||
                errorMsg.includes("resource_exhausted") ||
                errorMsg.includes("too many requests") ||
                errorMsg.includes("fetch");

            if (isQuotaOrNetworkError && KeyManager.rotate()) {
                attempts++;
                await new Promise(r => setTimeout(r, 500));
                continue;
            }

            if (isQuotaOrNetworkError || errorMsg.includes("404") || errorMsg.includes("not found")) {
                try {
                    const aiFallback = getAI();
                    const result = await aiFallback.models.generateContent({
                        model: fallbackModel,
                        contents,
                        config
                    });
                    return { result, isSafeMode: true };
                } catch (fallbackErr) {
                    if (KeyManager.rotate()) {
                        attempts++;
                        continue;
                    }
                }
            }
            throw err;
        }
    }
    throw new Error("All API keys have exhausted their quota. Please try again later.");
};
