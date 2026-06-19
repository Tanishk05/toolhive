import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextResponse } from "next/server";
import { getToolRegistry } from "@/features/tools/tool-registry";
import { logger } from "@/lib/logger";

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json();

    const tools = await getToolRegistry();
    const currentTool = context?.toolSlug ? tools.find((t) => t.slug === context.toolSlug) : null;

    let systemPrompt = `You are the ToolHive AI Assistant, an expert productivity and developer assistant embedded in the ToolHive platform. 
Your goal is to help users understand concepts, troubleshoot problems, and get the most out of our free tools. Keep answers concise, friendly, and formatted with markdown.`;

    if (currentTool) {
      systemPrompt += `\n\nContext Awareness: The user is currently looking at the "${currentTool.name}" tool (Category: ${currentTool.categoryLabel}).
Description: ${currentTool.description}
Focus your answers on helping them use this specific tool if they ask general questions. For example, if it's the JSON Formatter, explain JSON syntax or formatting. If it's the GST Calculator, explain how GST is calculated.`;
    }

    // Since we might not have a real OPENAI_API_KEY in this demo environment, 
    // we use a safe fallback or allow the SDK to throw if key is missing.
    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        "I am the ToolHive AI Assistant. It looks like my API key is not configured yet, but I'm ready to help you once the administrator adds it! You are currently viewing: " + (currentTool?.name || "the platform") + ".",
        { status: 200 }
      );
    }

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      system: systemPrompt,
      messages,
    });

    return NextResponse.json({ text });
  } catch (error) {
    logger.error("AI Assistant error", { error });
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}
