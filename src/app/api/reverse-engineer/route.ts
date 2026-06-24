import { streamObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { reverseEngineerSchema } from '@/lib/reverse-engineer-schema';

export const maxDuration = 60; // Allow up to 60 seconds for complex image analysis

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { url, imageBase64 } = await req.json();

    if (!url && !imageBase64) {
      return new Response('URL or Image is required', { status: 400 });
    }

    let userObj = null;
    if (userId) {
      userObj = await prisma.user.findUnique({ where: { clerkId: userId } });
    }

    if (userObj) {
      // Check generation limits
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const generatedToday = await prisma.reverseAnalysis.count({
        where: {
          userId: userObj.id,
          createdAt: {
            gte: today,
          },
        },
      });

      const isPremium = userObj.role === 'premium' || userObj.role === 'admin';
      
      if (!isPremium && generatedToday >= 5) {
        return new Response(JSON.stringify({ error: 'Limit reached. Upgrade to premium for unlimited analyses.' }), { status: 429 });
      }
    }

    const messages: any[] = [
      {
        role: 'system',
        content: 'You are an expert Senior UX Designer, Front-end Engineer, and Conversion Rate Optimization (CRO) specialist. Your goal is to deeply analyze, deconstruct, and reverse engineer the provided website design or image. Extract highly accurate color hex codes, identify typography, determine the tech stack, break down the UX layout, generate copy analysis, and provide an actionable developer blueprint and an AI recreation prompt. Provide a "design roast" to critique the work.',
      }
    ];

    if (imageBase64) {
      messages.push({
        role: 'user',
        content: [
          { type: 'text', text: `Please completely reverse engineer this design${url ? ` (URL: ${url})` : ''}.` },
          { type: 'image', image: imageBase64 }
        ]
      });
    } else {
      messages.push({
        role: 'user',
        content: `Please completely reverse engineer the following website URL: ${url}. Provide the best guess for its visual design, typography, stack, and copy based on its domain and typical patterns if you can't browse directly, but if you have access to its contents, use that.`
      });
    }

    const targetUrl = url || null;

    // Start streaming the object
    const result = await streamObject({
      model: openai('gpt-4o'), // Use a vision capable model
      schema: reverseEngineerSchema,
      messages,
      async onFinish({ object }) {
        if (object && userObj) {
          try {
            // Save to database
            const slug = (targetUrl ? targetUrl.replace(/[^a-z0-9]+/g, '-') : 'design') + '-' + Date.now().toString().slice(-6);
            await prisma.reverseAnalysis.create({
              data: {
                userId: userObj.id,
                targetUrl: targetUrl,
                content: object as any,
                isPublic: false,
                slug,
              }
            });
          } catch (e) {
            console.error("Failed to save reverse analysis", e);
          }
        }
      }
    });

    return result.toTextStreamResponse();
  } catch (e) {
    console.error(e);
    return new Response('Error processing request', { status: 500 });
  }
}
