import { GoogleGenAI } from "@google/genai";
import type { FamousPerson } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const fetchFamousBirthdaysForDate = async (date: Date): Promise<FamousPerson[]> => {
    const dateString = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

    const prompt = `List exactly 5 internationally famous people (like actors, musicians, historical figures, scientists, or athletes) whose birthday is on ${dateString}. For each person, provide their common full name (suitable for searching on APIs like Wikipedia) and a brief, one-sentence description of why they are famous. IMPORTANT: Respond with only a valid JSON object in the format: { "celebrities": [{ "name": "string", "description": "string" }] }. Do not include any text outside of this JSON object or markdown formatting.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
                // Per API requirements, responseMimeType and responseSchema cannot be used with tools.
                // We rely on the prompt to instruct the model to return JSON, and then parse the text response.
            },
        });
        
        let jsonText = response.text.trim();
        
        // The model might still wrap the JSON in markdown code fences. Let's strip them.
        if (jsonText.startsWith("```json")) {
            jsonText = jsonText.substring(7, jsonText.length - 3).trim();
        } else if (jsonText.startsWith("```")) {
             jsonText = jsonText.substring(3, jsonText.length - 3).trim();
        }

        const parsedJson = JSON.parse(jsonText);

        if (parsedJson && parsedJson.celebrities && Array.isArray(parsedJson.celebrities)) {
            return parsedJson.celebrities as FamousPerson[];
        } else {
            throw new Error("Invalid JSON structure received from API.");
        }

    } catch (error) {
        console.error("Error fetching famous birthdays from Gemini API:", error);
        throw new Error("Could not fetch birthday data from Google Gemini.");
    }
};

export const fetchImageFromGoogle = async (name: string): Promise<string | null> => {
    const prompt = `Using Google Search, find a publicly usable, direct link to a high-quality image of the famous person: "${name}". This could be a photograph or a well-known portrait for historical figures. The URL must point directly to an image file (e.g., .jpg, .png, .webp). Prioritize reliable sources like Wikimedia Commons, Wikipedia, Britannica, or official museum websites. Respond with ONLY the raw image URL. Do not include any other text, markdown, or explanation. If a suitable direct image link cannot be found after a thorough search, respond with the exact text "NOT_FOUND".`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const url = response.text.trim();

        // Basic validation to check if it's a valid URL and not the fallback text.
        if (url && url.startsWith('http') && url !== 'NOT_FOUND') {
            // Check for common image extensions to improve reliability
            if (/\.(jpg|jpeg|png|webp|gif)$/i.test(url)) {
                 console.log(`Found Google image for ${name}: ${url}`);
                 return url;
            }
        }
        console.warn(`Could not find a valid image URL from Google for ${name}. Response: "${url}"`);
        return null;

    } catch (error) {
        console.error(`Error fetching image from Google for "${name}":`, error);
        return null;
    }
};