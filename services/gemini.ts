import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const geminiService = {
  /**
   * Generates a professional engineering article draft based on a title/topic.
   */
  generateDraft: async (topic: string): Promise<{ content: string; summary: string }> => {
    if (!apiKey) {
      throw new Error("API Key is missing");
    }

    const model = 'gemini-2.5-flash';
    const prompt = `
      你是一家名为 "Apex 工程解决方案" (Apex Engineering Solutions) 的顶级土木和机械工程公司的高级技术撰稿人。
      请就以下主题撰写一篇专业的中文网站文章草稿："${topic}"。
      
      语气应专业、创新且具有权威性。
      文章结构清晰，分段合理。
      
      输出格式 (JSON):
      {
        "summary": "文章的2句简短摘要。",
        "content": "文章的完整内容，使用 \\n 进行换行。"
      }
    `;

    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7
        }
      });

      const text = response.text;
      if (!text) throw new Error("No response from AI");
      
      return JSON.parse(text);
    } catch (error) {
      console.error("Gemini Generation Error:", error);
      throw error;
    }
  }
};