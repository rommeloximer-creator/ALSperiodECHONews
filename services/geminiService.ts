
import { GoogleGenAI, Type } from "@google/genai";

// Use the API key directly from process.env.API_KEY as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const enhanceArticle = async (content: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Enhance the following text for a school news platform. Provide a punchy title, a compelling 2-sentence excerpt, and a refined version of the content. Original content: ${content}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            excerpt: { type: Type.STRING },
            refinedContent: { type: Type.STRING },
          },
          required: ["title", "excerpt", "refinedContent"]
        },
      },
    });
    
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};

export const researchTopic = async (topic: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Provide 5 interesting facts and current context about "${topic}" that would be useful for a journalist writing for an education community. Focus on accuracy.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    
    const text = response.text || "No information found.";
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    return { text, sources };
  } catch (error) {
    console.error("Gemini Research Error:", error);
    return { text: "Failed to gather research data.", sources: [] };
  }
};

export const suggestCategory = async (content: string) => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Based on this content, suggest the best category from: Headline, News, Lifestyle/Feature, Editorial, Sports and Health, Science and Technology, Entertainment, Livelihood, Success Stories, Literature. Content: ${content}`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    category: { type: Type.STRING }
                },
                required: ["category"]
            }
        }
      });
      return JSON.parse(response.text || '{}').category;
    } catch (e) {
        return "News";
    }
}
