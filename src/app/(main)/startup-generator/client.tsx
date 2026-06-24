"use client";

import React, { useState } from 'react';
import { experimental_useObject as useObject } from '@ai-sdk/react';
import { startupKitSchema } from '@/lib/startup-schema';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, Copy, Download, Loader2, Sparkles, Target, Zap, LayoutTemplate, PenTool, Code, LineChart, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function StartupGeneratorClient() {
  const [idea, setIdea] = useState('');
  
  const { submit, object, isLoading } = useObject({
    api: '/api/startup-generator',
    schema: startupKitSchema,
  });

  const handleGenerate = () => {
    if (!idea.trim()) {
      toast.error("Please enter your startup idea.");
      return;
    }
    submit({ idea });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const downloadMarkdown = () => {
    if (!object) return;
    
    let md = `# Startup Kit: ${object.identity?.names?.[0] || 'My Startup'}\n\n`;
    md += `Idea: ${idea}\n\n`;

    if (object.identity) {
      md += `## Identity\n`;
      md += `- **Names**: ${object.identity.names?.join(', ')}\n`;
      md += `- **Tagline**: ${object.identity.tagline}\n`;
      md += `- **Mission**: ${object.identity.missionStatement}\n`;
      md += `- **Elevator Pitch**: ${object.identity.elevatorPitch}\n`;
      md += `- **Brand Personality**: ${object.identity.brandPersonality}\n\n`;
    }

    if (object.branding) {
      md += `## Branding\n`;
      md += `- **Colors**: ${object.branding.colors?.join(', ')}\n`;
      md += `- **Typography**: ${object.branding.typography}\n`;
      md += `- **Logo Prompt**: ${object.branding.logoPrompt}\n\n`;
    }

    if (object.businessModel) {
      md += `## Business Model\n`;
      md += `**Problem**: ${object.businessModel.problemStatement}\n\n`;
      md += `**Solution**: ${object.businessModel.solution}\n\n`;
      md += `**Target Audience**: ${object.businessModel.targetAudience}\n\n`;
      md += `**Revenue Model**: ${object.businessModel.revenueModel}\n\n`;
    }

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `startup-kit-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const sections = [
    { id: 'identity', label: 'Startup Identity', icon: <Target className="w-4 h-4" />, status: object?.identity ? 'complete' : (isLoading && object ? 'generating' : 'pending') },
    { id: 'branding', label: 'Branding', icon: <PenTool className="w-4 h-4" />, status: object?.branding ? 'complete' : (isLoading && object?.identity ? 'generating' : 'pending') },
    { id: 'businessModel', label: 'Business Model', icon: <LineChart className="w-4 h-4" />, status: object?.businessModel ? 'complete' : (isLoading && object?.branding ? 'generating' : 'pending') },
    { id: 'marketingKit', label: 'Marketing Kit', icon: <Zap className="w-4 h-4" />, status: object?.marketingKit ? 'complete' : (isLoading && object?.businessModel ? 'generating' : 'pending') },
    { id: 'landingPage', label: 'Landing Page Copy', icon: <LayoutTemplate className="w-4 h-4" />, status: object?.landingPage ? 'complete' : (isLoading && object?.marketingKit ? 'generating' : 'pending') },
    { id: 'contentKit', label: 'Content Kit', icon: <FileText className="w-4 h-4" />, status: object?.contentKit ? 'complete' : (isLoading && object?.landingPage ? 'generating' : 'pending') },
    { id: 'technicalBlueprint', label: 'Technical Blueprint', icon: <Code className="w-4 h-4" />, status: object?.technicalBlueprint ? 'complete' : (isLoading && object?.contentKit ? 'generating' : 'pending') },
    { id: 'investorKit', label: 'Investor Kit', icon: <Sparkles className="w-4 h-4" />, status: object?.investorKit ? 'complete' : (isLoading && object?.technicalBlueprint ? 'generating' : 'pending') },
  ];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 md:py-20">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-foreground">
          Startup <span className="text-primary">Generator</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Turn your idea into a complete startup kit in under 60 seconds.
        </p>
        
        {!object && !isLoading && (
          <Card className="p-2 flex flex-col md:flex-row gap-2 shadow-xl border-border bg-card/50 backdrop-blur">
            <Textarea 
              placeholder='e.g. "AI-powered fitness app for busy professionals"'
              className="resize-none border-none focus-visible:ring-0 text-lg py-4 px-4 min-h-[80px]"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
            />
            <Button 
              size="lg" 
              onClick={handleGenerate}
              className="h-auto md:w-48 py-4 px-8 text-lg font-medium shadow-md transition-all hover:scale-[1.02]"
            >
              Generate
              <Sparkles className="w-5 h-5 ml-2" />
            </Button>
          </Card>
        )}
      </div>

      {(object || isLoading) && (
        <div className="flex flex-col lg:flex-row gap-8 items-start relative">
          
          {/* Sticky Sidebar */}
          <div className="lg:w-1/4 w-full lg:sticky lg:top-24 space-y-2">
            <div className="font-semibold text-lg mb-4 pl-4">Generation Progress</div>
            <div className="flex flex-col gap-1">
              {sections.map((s) => (
                <a 
                  key={s.id} 
                  href={`#${s.id}`}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    s.status === 'complete' ? 'bg-primary/10 text-primary' : 
                    s.status === 'generating' ? 'bg-card border shadow-sm' : 
                    'text-muted-foreground opacity-50 hover:opacity-100'
                  }`}
                >
                  {s.status === 'complete' && <CheckCircle2 className="w-5 h-5" />}
                  {s.status === 'generating' && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
                  {s.status === 'pending' && <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />}
                  <span className="font-medium">{s.label}</span>
                </a>
              ))}
            </div>

            {/* Export Actions (show when complete) */}
            {!isLoading && object && (
              <div className="mt-8 pt-6 border-t space-y-3">
                <Button className="w-full justify-start" variant="outline" onClick={downloadMarkdown}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Markdown
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={() => toast.success('PDF Export coming soon!')}>
                  <FileText className="w-4 h-4 mr-2" />
                  Export to PDF
                </Button>
              </div>
            )}
          </div>

          {/* Results Area */}
          <div className="lg:w-3/4 w-full space-y-12">
            
            {/* 1. Identity */}
            {(object?.identity || (isLoading && !object)) && (
              <section id="identity" className="scroll-mt-24 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Target className="text-primary" /> Startup Identity
                  </h2>
                </div>
                
                <Card className="p-6 space-y-8 bg-card shadow-lg border-border/50">
                  {object?.identity?.names && (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-muted-foreground uppercase tracking-wider text-sm">Generated Names</h3>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(object?.identity?.names?.join('\n') || '')}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {object.identity.names.map((n, i) => (
                          n && (
                            <div key={i} className="px-4 py-2 bg-primary/5 border border-primary/20 rounded-lg font-medium text-primary">
                              {n}
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-8">
                    {object?.identity?.tagline && (
                      <div>
                         <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Tagline</h3>
                         <p className="text-lg">{object.identity.tagline}</p>
                      </div>
                    )}
                    {object?.identity?.missionStatement && (
                      <div>
                         <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Mission Statement</h3>
                         <p className="text-lg">{object.identity.missionStatement}</p>
                      </div>
                    )}
                  </div>
                  
                  {object?.identity?.elevatorPitch && (
                    <div>
                       <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Elevator Pitch</h3>
                       <p className="text-lg leading-relaxed">{object.identity.elevatorPitch}</p>
                    </div>
                  )}
                  
                  {object?.identity?.brandPersonality && (
                    <div>
                       <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Brand Personality</h3>
                       <p className="text-lg">{object.identity.brandPersonality}</p>
                    </div>
                  )}
                </Card>
              </section>
            )}

            {/* 2. Branding */}
            {(object?.branding) && (
              <section id="branding" className="scroll-mt-24 space-y-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <PenTool className="text-primary" /> Brand Identity
                </h2>
                <Card className="p-6 space-y-8 bg-card shadow-lg border-border/50">
                  {object?.branding?.colors && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Brand Colors</h3>
                      <div className="flex gap-4 flex-wrap">
                        {object.branding.colors.map((c, i) => (
                          c && (
                            <div key={i} className="flex flex-col items-center gap-2">
                              <div className="w-16 h-16 rounded-full shadow-inner border border-white/10" style={{ backgroundColor: c }} />
                              <span className="text-sm font-mono">{c}</span>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                  {object?.branding?.typography && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Typography</h3>
                      <p className="text-lg">{object.branding.typography}</p>
                    </div>
                  )}
                  {object?.branding?.logoPrompt && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Logo Design Prompt</h3>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(object?.branding?.logoPrompt || '')}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="p-4 bg-muted rounded-xl text-muted-foreground italic">
                        "{object.branding.logoPrompt}"
                      </div>
                    </div>
                  )}
                </Card>
              </section>
            )}

            {/* 3. Business Model */}
            {(object?.businessModel) && (
              <section id="businessModel" className="scroll-mt-24 space-y-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <LineChart className="text-primary" /> Business Model
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="p-6 space-y-2 bg-card shadow-md">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Problem Statement</h3>
                    <p>{object.businessModel.problemStatement}</p>
                  </Card>
                  <Card className="p-6 space-y-2 bg-card shadow-md">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Solution</h3>
                    <p>{object.businessModel.solution}</p>
                  </Card>
                  <Card className="p-6 space-y-2 bg-card shadow-md">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Target Audience</h3>
                    <p>{object.businessModel.targetAudience}</p>
                  </Card>
                  <Card className="p-6 space-y-2 bg-card shadow-md">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Revenue Model</h3>
                    <p>{object.businessModel.revenueModel}</p>
                  </Card>
                </div>
                <Card className="p-6 space-y-4 bg-card shadow-md">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Competitive Advantages</h3>
                  <ul className="space-y-2">
                    {object.businessModel.competitiveAdvantages?.map((adv, i) => (
                      adv && (
                        <li key={i} className="flex gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                          <span>{adv}</span>
                        </li>
                      )
                    ))}
                  </ul>
                </Card>
              </section>
            )}

            {/* 4. Marketing Kit */}
            {(object?.marketingKit) && (
               <section id="marketingKit" className="scroll-mt-24 space-y-6">
                 <h2 className="text-2xl font-bold flex items-center gap-2">
                   <Zap className="text-primary" /> Marketing Kit
                 </h2>
                 <Card className="p-6 space-y-8 bg-card shadow-md">
                   <div className="grid md:grid-cols-2 gap-6">
                     <div>
                       <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Meta Title</h3>
                       <p className="font-medium">{object.marketingKit.metaTitle}</p>
                     </div>
                     <div>
                       <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Meta Description</h3>
                       <p>{object.marketingKit.metaDescription}</p>
                     </div>
                     <div>
                       <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Social Media Bio</h3>
                       <p>{object.marketingKit.socialMediaBio}</p>
                     </div>
                     <div>
                       <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">SEO Description</h3>
                       <p>{object.marketingKit.seoDescription}</p>
                     </div>
                   </div>
                   
                   {object.marketingKit.launchTweets && object.marketingKit.launchTweets.length > 0 && (
                     <div>
                       <div className="flex justify-between items-center mb-4">
                         <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Launch Tweets</h3>
                         <Button variant="ghost" size="sm" onClick={() => copyToClipboard(object.marketingKit?.launchTweets?.join('\n\n') || '')}>
                           <Copy className="w-4 h-4" />
                         </Button>
                       </div>
                       <div className="space-y-4">
                         {object.marketingKit.launchTweets.map((tweet, i) => (
                           tweet && (
                             <div key={i} className="p-4 bg-muted/50 rounded-xl border border-border/50 text-sm">
                               {tweet}
                             </div>
                           )
                         ))}
                       </div>
                     </div>
                   )}
                 </Card>
               </section>
            )}

            {/* 5. Landing Page Copy */}
            {(object?.landingPage) && (
               <section id="landingPage" className="scroll-mt-24 space-y-6">
                 <h2 className="text-2xl font-bold flex items-center gap-2">
                   <LayoutTemplate className="text-primary" /> Landing Page Copy
                 </h2>
                 <Card className="p-8 space-y-8 bg-card shadow-md border-t-4 border-t-primary">
                   <div className="text-center max-w-2xl mx-auto space-y-4">
                     <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold tracking-wider uppercase mb-2">Hero Section</div>
                     <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{object.landingPage.heroHeadline}</h1>
                     <p className="text-xl text-muted-foreground">{object.landingPage.heroSubheadline}</p>
                     <Button size="lg" className="mt-4">{object.landingPage.ctaText}</Button>
                   </div>
                   
                   {object.landingPage.features && object.landingPage.features.length > 0 && (
                     <div className="pt-8 border-t border-border">
                       <h3 className="text-xl font-bold mb-6 text-center">Features</h3>
                       <div className="grid md:grid-cols-3 gap-6">
                         {object.landingPage.features.map((feat, i) => (
                           feat && (
                             <div key={i} className="p-5 bg-muted/30 rounded-2xl border border-border/40">
                               <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                 <Sparkles className="w-5 h-5 text-primary" />
                               </div>
                               <h4 className="font-bold mb-2">{feat.title}</h4>
                               <p className="text-sm text-muted-foreground">{feat.description}</p>
                             </div>
                           )
                         ))}
                       </div>
                     </div>
                   )}
                 </Card>
               </section>
            )}

            {/* 6. Content Kit */}
            {(object?.contentKit) && (
               <section id="contentKit" className="scroll-mt-24 space-y-6">
                 <h2 className="text-2xl font-bold flex items-center gap-2">
                   <FileText className="text-primary" /> Content Kit
                 </h2>
                 <div className="grid md:grid-cols-2 gap-6">
                   <Card className="p-6 bg-card shadow-md">
                     <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Blog Post Ideas</h3>
                     <ul className="space-y-3">
                       {object.contentKit.blogPostIdeas?.map((idea, i) => (
                         idea && (
                           <li key={i} className="flex gap-3 text-sm">
                             <span className="text-primary font-mono">{i + 1}.</span>
                             <span>{idea}</span>
                           </li>
                         )
                       ))}
                     </ul>
                   </Card>
                   <Card className="p-6 bg-card shadow-md">
                     <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Marketing Campaigns</h3>
                     <ul className="space-y-3">
                       {object.contentKit.marketingCampaigns?.map((camp, i) => (
                         camp && (
                           <li key={i} className="flex gap-3 text-sm">
                             <span className="text-primary font-mono">{i + 1}.</span>
                             <span>{camp}</span>
                           </li>
                         )
                       ))}
                     </ul>
                   </Card>
                 </div>
               </section>
            )}

            {/* 7. Technical Blueprint */}
            {(object?.technicalBlueprint) && (
               <section id="technicalBlueprint" className="scroll-mt-24 space-y-6">
                 <h2 className="text-2xl font-bold flex items-center gap-2">
                   <Code className="text-primary" /> Technical Blueprint
                 </h2>
                 <Card className="p-6 bg-card shadow-md">
                   <div className="grid md:grid-cols-2 gap-8">
                     <div>
                       <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Tech Stack</h3>
                       <p className="text-lg font-medium">{object.technicalBlueprint.recommendedTechStack}</p>
                     </div>
                     <div>
                       <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Database</h3>
                       <p className="text-lg font-medium">{object.technicalBlueprint.databaseRecommendation}</p>
                     </div>
                     <div>
                       <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Authentication</h3>
                       <p className="text-lg font-medium">{object.technicalBlueprint.authenticationStrategy}</p>
                     </div>
                     <div>
                       <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Hosting</h3>
                       <p className="text-lg font-medium">{object.technicalBlueprint.hostingRecommendation}</p>
                     </div>
                   </div>
                   <div className="mt-8 pt-6 border-t border-border">
                     <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Scalability</h3>
                     <p>{object.technicalBlueprint.scalabilitySuggestions}</p>
                   </div>
                 </Card>
               </section>
            )}

            {/* 8. Investor Kit */}
            {(object?.investorKit) && (
               <section id="investorKit" className="scroll-mt-24 space-y-6">
                 <h2 className="text-2xl font-bold flex items-center gap-2">
                   <Sparkles className="text-primary" /> Investor Kit
                 </h2>
                 <div className="grid md:grid-cols-2 gap-6">
                   <Card className="p-6 bg-card shadow-md border-primary/20">
                     <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">One-Line Pitch</h3>
                     <p className="text-xl font-bold">{object.investorKit.oneLinePitch}</p>
                   </Card>
                   <Card className="p-6 bg-card shadow-md">
                     <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Market Opportunity</h3>
                     <p>{object.investorKit.marketOpportunity}</p>
                   </Card>
                   <Card className="p-6 bg-card shadow-md">
                     <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Problem Slide</h3>
                     <p>{object.investorKit.problemSlide}</p>
                   </Card>
                   <Card className="p-6 bg-card shadow-md">
                     <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Solution Slide</h3>
                     <p>{object.investorKit.solutionSlide}</p>
                   </Card>
                 </div>
                 <Card className="p-6 bg-card shadow-md">
                   <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Revenue Projection</h3>
                   <p>{object.investorKit.revenueProjectionFramework}</p>
                 </Card>
               </section>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
