import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { QUESTIONS_PROMPT } from "@/lib/services/Constants";

export async function POST(req) {
  try {
    // ✅ SAFE BODY PARSE
    let body;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Request body missing" },
        { status: 400 }
      );
    }

    console.log("BODY RECEIVED:", body);

    const {
      jobPosition,
      jobDescription,
      duration,
      interviewType,
    } = body;

    // ✅ VALIDATION
    if (!jobPosition || !jobDescription || !duration) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const FINAL_PROMPT = `
${QUESTIONS_PROMPT}

Return ONLY valid JSON:

{
  "questions":[
    {
      "question":"string",
      "type":"Easy | Medium | Hard",
      "answer":"string"
    }
  ]
}

Job Title: ${jobPosition}
Job Description: ${jobDescription}
Duration: ${duration}
Type: ${interviewType}
`;

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "user", content: FINAL_PROMPT },
      ],
      temperature: 0.4,
    });

    let responseText =
      completion.choices?.[0]?.message?.content || "";

    // ✅ remove markdown
    responseText = responseText
      .replace(/```json|```/g, "")
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(responseText);
    } catch (err) {
      console.error("JSON PARSE ERROR:", responseText);
      return NextResponse.json(
        { error: "AI returned invalid JSON" },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("GROQ ERROR:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}