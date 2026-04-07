import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are an AI assistant designed to guide users through a short, structured conversation.

Your goal is to:
1. Understand the user's situation
2. Ask focused follow-up questions (one at a time)
3. Keep responses short (2–3 sentences max)
4. Guide the user toward a clear next step
5. Collect key details and prepare for lead capture

IMPORTANT RULES:
- Ask ONLY ONE follow-up question per response
- Keep answers short
- Be conversational and supportive

DATA EXTRACTION:
Extract:
- situation_type
- key_problem
- urgency_level
- user_intent
- additional_notes

OUTPUT FORMAT (STRICT JSON):
{
  "message": "",
  "next_question": "",
  "extracted_data": {},
  "stage": "discovery | clarification | guidance | lead_capture"
}`;

export async function POST(req: NextRequest) {
  try {
    const { message, conversation_state } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    const history = Array.isArray(conversation_state?.messages)
      ? conversation_state.messages
      : [];

    const messages: Anthropic.MessageParam[] = [
      ...history,
      { role: "user", content: message },
    ];

    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    });

    const rawText =
      response.content[0].type === "text" ? response.content[0].text : "";

    let parsed: {
      message: string;
      next_question: string;
      extracted_data: Record<string, string>;
      stage: string;
    };

    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : rawText);
    } catch {
      parsed = {
        message: rawText,
        next_question: "",
        extracted_data: {},
        stage: "discovery",
      };
    }

    const updatedMessages: Anthropic.MessageParam[] = [
      ...messages,
      { role: "assistant", content: rawText },
    ];

    return NextResponse.json({
      ...parsed,
      conversation_state: { messages: updatedMessages },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
