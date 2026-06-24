import { streamObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { startupKitSchema } from '@/lib/startup-schema';

export const maxDuration = 60; // Allow up to 60 seconds

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { idea } = await req.json();

    if (!idea || typeof idea !== 'string') {
      return new Response('Idea is required', { status: 400 });
    }

    let userObj = null;
    if (userId) {
      userObj = await prisma.user.findUnique({ where: { clerkId: userId } });
    }

    if (userObj) {
      // Check generation limits
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const generatedToday = await prisma.startupKit.count({
        where: {
          userId: userObj.id,
          createdAt: {
            gte: today,
          },
        },
      });

      const isPremium = userObj.role === 'premium' || userObj.role === 'admin';
      
      if (!isPremium && generatedToday >= 3) {
        return new Response(JSON.stringify({ error: 'Limit reached' }), { status: 429 });
      }
    }

    // Start streaming the object
    const result = await streamObject({
      model: openai('gpt-4-turbo'),
      schema: startupKitSchema,
      prompt: `You are an expert startup generator and seasoned entrepreneur. Given the following startup idea, generate a comprehensive, professional, and detailed startup kit. Provide high-quality, realistic, and actionable content. 
      
Startup Idea: "${idea}"

Make sure to provide exactly the items requested in the schema, with excellent marketing copy, robust business models, and a viable technical blueprint. For the investor kit, use convincing and standard VC language.
`,
      async onFinish({ object }) {
        if (object && userObj) {
          try {
            // Save to database
            const slug = idea.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50) + '-' + Date.now().toString().slice(-6);
            await prisma.startupKit.create({
              data: {
                userId: userObj.id,
                idea: idea,
                name: object.identity?.names?.[0] || 'My Startup',
                content: object as any,
                isPublic: false,
                slug,
              }
            });
          } catch (e) {
            console.error("Failed to save startup kit", e);
          }
        }
      }
    });

    return result.toTextStreamResponse();
  } catch (e) {
    console.error(e);
    return new Response('Error', { status: 500 });
  }
}
