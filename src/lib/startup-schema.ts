import { z } from 'zod';

export const startupKitSchema = z.object({
  identity: z.object({
    names: z.array(z.string()).describe("Generate exactly 10 startup name options"),
    tagline: z.string(),
    missionStatement: z.string(),
    elevatorPitch: z.string(),
    brandPersonality: z.string(),
  }).optional(),
  branding: z.object({
    colors: z.array(z.string()).describe("Hex codes for brand colors"),
    typography: z.string(),
    logoPrompt: z.string(),
    visualStyleGuide: z.string(),
  }).optional(),
  businessModel: z.object({
    problemStatement: z.string(),
    solution: z.string(),
    targetAudience: z.string(),
    revenueModel: z.string(),
    pricingStrategy: z.string(),
    competitiveAdvantages: z.array(z.string()),
  }).optional(),
  marketingKit: z.object({
    seoDescription: z.string(),
    metaTitle: z.string(),
    metaDescription: z.string(),
    socialMediaBio: z.string(),
    launchTweets: z.array(z.string()).describe("Exactly 10 launch tweets"),
    linkedinLaunchPost: z.string(),
    productHuntDescription: z.string(),
  }).optional(),
  landingPage: z.object({
    heroHeadline: z.string(),
    heroSubheadline: z.string(),
    ctaText: z.string(),
    features: z.array(z.object({
      title: z.string(),
      description: z.string(),
    })),
    benefits: z.array(z.string()),
    testimonials: z.array(z.object({
      quote: z.string(),
      author: z.string(),
      role: z.string(),
    })),
    faq: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })),
  }).optional(),
  contentKit: z.object({
    blogPostIdeas: z.array(z.string()).describe("Exactly 10 ideas"),
    marketingCampaigns: z.array(z.string()).describe("Exactly 10 ideas"),
    seoKeywords: z.array(z.string()).describe("Exactly 20 keywords"),
  }).optional(),
  technicalBlueprint: z.object({
    recommendedTechStack: z.string(),
    databaseRecommendation: z.string(),
    authenticationStrategy: z.string(),
    hostingRecommendation: z.string(),
    scalabilitySuggestions: z.string(),
  }).optional(),
  investorKit: z.object({
    oneLinePitch: z.string(),
    problemSlide: z.string(),
    solutionSlide: z.string(),
    marketOpportunity: z.string(),
    revenueProjectionFramework: z.string(),
  }).optional(),
});

export type StartupKit = z.infer<typeof startupKitSchema>;
