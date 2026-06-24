import { streamObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const maxDuration = 60;

const aiCollectionSchema = z.object({
  name: z.string().describe("A catchy, professional name for the collection"),
  description: z.string().describe("A 1-2 sentence description of what the collection is for"),
  tools: z.array(z.string()).describe("A list of 5-10 specific, existing SaaS tool names or technologies (e.g., 'Figma', 'Vercel', 'Next.js', 'TailwindCSS', 'Stripe') that fit the prompt."),
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!dbUser) {
      return new Response("User not found", { status: 404 });
    }

    const { prompt } = await req.json();

    if (!prompt) {
      return new Response("Prompt is required", { status: 400 });
    }

    const result = await streamObject({
      model: openai("gpt-4o"),
      schema: aiCollectionSchema,
      prompt: `You are an expert curator of software tools. Build a curated "Tool Collection" for the following user request: "${prompt}". Suggest a perfect, cohesive stack of real-world tools that this user should use.`,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("AI Collection Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
