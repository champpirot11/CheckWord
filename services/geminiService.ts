import { GoogleGenAI, Type } from "@google/genai";
import { ProofreadResult } from "../types";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key-for-build' });

const PROOFREAD_SYSTEM_INSTRUCTION = `
คุณคือผู้เชี่ยวชาญด้านการพิสูจน์อักษรและบรรณาธิการภาษาไทย (Thai Proofreader & Editor) หน้าที่ของคุณคือตรวจสอบข้อความที่ได้รับและแก้ไขให้ถูกต้องตามหลักภาษา โดยยังคงน้ำเสียง (Tone) และสไตล์การเขียนเดิมของผู้เขียนไว้

กฎการทำงาน:
1. แก้ไขคำผิด (Spelling errors)
2. แก้ไขไวยากรณ์ (Grammar) และการเรียงประโยคที่สับสน
3. ปรับการเว้นวรรค (Spacing) ให้ถูกต้องตามหลักภาษาไทย
4. ห้ามเปลี่ยนความหมายเดิมของข้อความ
5. หากเป็นคำสแลงหรือภาษาพูดที่ตั้งใจใช้เพื่ออรรถรส ให้คงไว้ (ยกเว้นกรณีที่พิมพ์ผิดจริงๆ)
`;

export const proofreadText = async (text: string): Promise<ProofreadResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: text,
      config: {
        systemInstruction: PROOFREAD_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            original_text: { type: Type.STRING },
            corrected_text: { type: Type.STRING },
            overall_comment: { type: Type.STRING },
            changes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  corrected: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ["spelling", "grammar", "spacing", "other"] },
                  explanation: { type: Type.STRING },
                },
                required: ["original", "corrected", "type", "explanation"]
              }
            }
          },
          required: ["original_text", "corrected_text", "changes", "overall_comment"]
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response received from AI");
    }

    const result = JSON.parse(responseText) as ProofreadResult;
    return result;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};