"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { experimental_useObject as useObject } from '@ai-sdk/react';
import { reverseEngineerSchema } from '@/lib/reverse-engineer-schema';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  Link as LinkIcon, Image as ImageIcon, CheckCircle2, 
  Copy, Loader2, Sparkles, LayoutTemplate, 
  Type, Palette, Code, Layers, FileText, Search, Zap, Frown 
} from 'lucide-react';

const ScoreCircle = ({ score, label }: { score?: number, label: string }) => (
  <div className="flex flex-col items-center">
    <div className="relative w-20 h-20 flex items-center justify-center rounded-full bg-muted border-4 border-muted">
      {score !== undefined ? (
        <span className="text-xl font-bold">{score}</span>
      ) : (
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      )}
      {score !== undefined && (
        <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="46" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-primary opacity-20" />
          <circle cx="50" cy="50" r="46" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-primary" strokeDasharray={`${score * 2.89} 289`} strokeLinecap="round" />
        </svg>
      )}
    </div>
    <span className="text-xs font-semibold uppercase tracking-wider mt-3 text-muted-foreground">{label}</span>
  </div>
);

export default function ReverseEngineerClient() {
  const [url, setUrl] = useState('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('visualDesign');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { submit, object, isLoading } = useObject({
    api: '/api/reverse-engineer',
    schema: reverseEngineerSchema,
  });

  const handleGenerate = () => {
    if (!url.trim() && !imageBase64) {
      toast.error("Please enter a URL or upload an image.");
      return;
    }
    submit({ url, imageBase64 });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setImageBase64(base64);
      setPreviewImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const handlePaste = useCallback((e: globalThis.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          if (file.size > 5 * 1024 * 1024) {
            toast.error("Pasted image must be less than 5MB.");
            return;
          }
          const reader = new FileReader();
          reader.onload = (event) => {
            const base64 = event.target?.result as string;
            setImageBase64(base64);
            setPreviewImage(base64);
            toast.success("Image pasted successfully!");
          };
          reader.readAsDataURL(file);
        }
        break;
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const tabs = [
    { id: 'visualDesign', label: 'Visual Design', icon: <Palette className="w-4 h-4" />, hasData: !!object?.visualDesign },
    { id: 'typography', label: 'Typography', icon: <Type className="w-4 h-4" />, hasData: !!object?.typography },
    { id: 'uxBreakdown', label: 'UX & Layout', icon: <LayoutTemplate className="w-4 h-4" />, hasData: !!object?.uxBreakdown },
    { id: 'techStack', label: 'Tech Stack', icon: <Layers className="w-4 h-4" />, hasData: !!object?.techStack },
    { id: 'copywriting', label: 'Copywriting', icon: <FileText className="w-4 h-4" />, hasData: !!object?.copywriting },
    { id: 'seoAnalysis', label: 'SEO', icon: <Search className="w-4 h-4" />, hasData: !!object?.seoAnalysis },
    { id: 'developerBlueprint', label: 'Blueprint & AI', icon: <Code className="w-4 h-4" />, hasData: !!object?.developerBlueprint || !!object?.aiRecreationPrompt },
    { id: 'competitorAnalysis', label: 'Competitors', icon: <Zap className="w-4 h-4" />, hasData: !!object?.competitorAnalysis },
    { id: 'designRoast', label: 'Design Roast', icon: <Frown className="w-4 h-4" />, hasData: !!object?.designRoast },
  ];


  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 md:py-20">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-foreground">
          Reverse Engineer <span className="text-primary">Anything</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Upload a screenshot, logo, or paste a URL to instantly extract design systems, tech stacks, and UX insights.
        </p>
        
        {!object && !isLoading && (
          <Card className="p-8 shadow-xl border-border bg-card/50 backdrop-blur max-w-2xl mx-auto">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="https://example.com" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="h-12 text-lg"
                />
              </div>
              
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-border"></div>
                <span className="flex-shrink-0 mx-4 text-muted-foreground text-sm font-medium">OR</span>
                <div className="flex-grow border-t border-border"></div>
              </div>

              <div 
                className="border-2 border-dashed border-border rounded-xl p-10 text-center hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      setImageBase64(ev.target?.result as string);
                      setPreviewImage(ev.target?.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileUpload}
                />
                
                {previewImage ? (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                    { }
                    <img src={previewImage} alt="Preview" className="w-full h-full object-contain bg-black/5" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <ImageIcon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">Drag & Drop Image</h3>
                    <p className="text-sm text-muted-foreground">or click to browse. You can also paste directly (Ctrl+V).</p>
                  </div>
                )}
              </div>

              <Button size="lg" className="w-full h-14 text-lg font-bold" onClick={handleGenerate}>
                Analyze Now <Sparkles className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </Card>
        )}
      </div>

      {(object || isLoading) && (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 shrink-0 lg:sticky lg:top-24 space-y-1 h-fit">
            <div className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4 px-3">Analysis Modules</div>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                disabled={!tab.hasData && !isLoading}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : tab.hasData 
                      ? 'hover:bg-muted text-foreground' 
                      : 'text-muted-foreground opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3">
                  {tab.icon}
                  {tab.label}
                </div>
                {isLoading && !tab.hasData && activeTab === tab.id && (
                  <Loader2 className="w-3 h-3 animate-spin" />
                )}
                {tab.hasData && activeTab !== tab.id && (
                  <CheckCircle2 className="w-3 h-3 text-primary" />
                )}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 min-w-0 space-y-8">
            
            {/* 1. Visual Design */}
            {activeTab === 'visualDesign' && (object?.visualDesign || isLoading) && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold flex items-center gap-2"><Palette className="text-primary" /> Visual Design Analysis</h2>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(JSON.stringify(object?.visualDesign, null, 2))}>
                    <Copy className="w-4 h-4 mr-2" /> Tailwind Config
                  </Button>
                </div>
                
                <Card className="p-6">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Color Palette</h3>
                  
                  <div className="space-y-6">
                    {object?.visualDesign?.primaryColors && object?.visualDesign?.primaryColors.length > 0 && (
                      <div>
                        <div className="text-sm font-medium mb-3">Primary Colors</div>
                        <div className="flex flex-wrap gap-4">
                          {object?.visualDesign?.primaryColors.map((color, i) => (
                            color && (
                              <div key={i} className="group relative">
                                <div className="w-16 h-16 rounded-xl shadow-inner border border-black/5" style={{ backgroundColor: color }} />
                                <div className="mt-2 text-xs font-mono text-center uppercase">{color}</div>
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {object?.visualDesign?.secondaryColors && object?.visualDesign?.secondaryColors.length > 0 && (
                      <div>
                        <div className="text-sm font-medium mb-3">Secondary Colors</div>
                        <div className="flex flex-wrap gap-4">
                          {object?.visualDesign?.secondaryColors.map((color, i) => (
                            color && (
                              <div key={i} className="group relative">
                                <div className="w-12 h-12 rounded-lg shadow-inner border border-black/5" style={{ backgroundColor: color }} />
                                <div className="mt-2 text-xs font-mono text-center uppercase">{color}</div>
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Border Radius</h3>
                    <p>{object?.visualDesign?.borderRadiusSystem}</p>
                  </Card>
                  <Card className="p-6">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Shadows</h3>
                    <p>{object?.visualDesign?.shadowStyles}</p>
                  </Card>
                  <Card className="p-6">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Gradients</h3>
                    <p>{object?.visualDesign?.gradientStyles}</p>
                  </Card>
                  <Card className="p-6">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Spacing & Density</h3>
                    <p>{object?.visualDesign?.spacingSystem}</p>
                  </Card>
                </div>
              </div>
            )}

            {/* Typography */}
            {activeTab === 'typography' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold flex items-center gap-2"><Type className="text-primary" /> Typography Breakdown</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="p-6 bg-card border-l-4 border-l-primary">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Headline Fonts</h3>
                    <div className="space-y-2">
                      {object?.typography?.headlineFonts?.map((font, i) => (
                        font && <div key={i} className="text-3xl font-bold" style={{ fontFamily: font }}>{font}</div>
                      ))}
                    </div>
                  </Card>
                  
                  <Card className="p-6">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Body Fonts</h3>
                    <div className="space-y-2">
                      {object?.typography?.bodyFonts?.map((font, i) => (
                        font && <div key={i} className="text-lg" style={{ fontFamily: font }}>{font}</div>
                      ))}
                    </div>
                  </Card>
                </div>

                <Card className="p-6 space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Pairing Logic</h3>
                    <p>{object?.typography?.fontPairings}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-6 pt-6 border-t">
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Sizes</h3>
                      <p className="text-sm">{object?.typography?.fontSizes}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Weights</h3>
                      <p className="text-sm">{object?.typography?.fontWeights}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Line Heights</h3>
                      <p className="text-sm">{object?.typography?.lineHeights}</p>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* More sections below... */}
            {/* UX Breakdown */}
            {activeTab === 'uxBreakdown' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold flex items-center gap-2"><LayoutTemplate className="text-primary" /> UX & Layout</h2>
                
                <Card className="p-8 mb-6 bg-card">
                  <div className="flex justify-around items-center">
                    <ScoreCircle score={object?.uxBreakdown?.uxScore} label="Overall UX" />
                    <ScoreCircle score={object?.uxBreakdown?.accessibilityScore} label="Accessibility" />
                    <ScoreCircle score={object?.uxBreakdown?.mobileFriendlinessScore} label="Mobile" />
                    <ScoreCircle score={object?.uxBreakdown?.conversionScore} label="Conversion" />
                  </div>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Layout Structure</h3>
                    <p>{object?.uxBreakdown?.layoutStructure}</p>
                  </Card>
                  <Card className="p-6">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">User Journey</h3>
                    <p>{object?.uxBreakdown?.userJourney}</p>
                  </Card>
                </div>
              </div>
            )}

            {/* Tech Stack */}
            {activeTab === 'techStack' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold flex items-center gap-2"><Layers className="text-primary" /> Tech Stack Detection</h2>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="p-6 border-t-4 border-t-blue-500">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Framework</h3>
                    <p className="text-xl font-bold">{object?.techStack?.framework}</p>
                  </Card>
                  {object?.techStack?.cms && (
                    <Card className="p-6 border-t-4 border-t-green-500">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">CMS</h3>
                      <p className="text-xl font-bold">{object?.techStack?.cms}</p>
                    </Card>
                  )}
                  {object?.techStack?.hostingProvider && (
                    <Card className="p-6 border-t-4 border-t-purple-500">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Hosting</h3>
                      <p className="text-xl font-bold">{object?.techStack?.hostingProvider}</p>
                    </Card>
                  )}
                </div>

                <Card className="p-6">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Libraries & Tools</h3>
                  <div className="flex flex-wrap gap-3">
                    {object?.techStack?.uiLibraries?.map((lib, i) => lib && <span key={`ui-${i}`} className="px-3 py-1 bg-muted rounded-full text-sm font-medium">{lib}</span>)}
                    {object?.techStack?.animationLibraries?.map((lib, i) => lib && <span key={`anim-${i}`} className="px-3 py-1 bg-muted rounded-full text-sm font-medium">{lib}</span>)}
                    {object?.techStack?.analyticsTools?.map((tool, i) => tool && <span key={`analytics-${i}`} className="px-3 py-1 bg-muted rounded-full text-sm font-medium">{tool}</span>)}
                  </div>
                </Card>
              </div>
            )}

            {/* Developer Blueprint */}
            {activeTab === 'developerBlueprint' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold flex items-center gap-2"><Code className="text-primary" /> Blueprint & AI Prompt</h2>
                
                {object?.aiRecreationPrompt && (
                  <Card className="p-6 bg-card border border-primary/20">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">AI Recreation Prompt (v0, Claude, Cursor)</h3>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(object?.aiRecreationPrompt?.uiPrompt || '')}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg text-sm font-mono whitespace-pre-wrap">
                      {object?.aiRecreationPrompt?.uiPrompt}
                    </div>
                  </Card>
                )}

                {object?.developerBlueprint && (
                  <Card className="p-6">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Folder Structure</h3>
                    <div className="p-4 bg-black/90 text-green-400 rounded-lg text-sm font-mono whitespace-pre-wrap">
                      {object?.developerBlueprint?.folderStructure}
                    </div>
                  </Card>
                )}
              </div>
            )}
            
            {/* Design Roast */}
            {activeTab === 'designRoast' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold flex items-center gap-2"><Frown className="text-primary" /> Design Roast</h2>
                
                <Card className="p-6 border-l-4 border-l-red-500 bg-red-500/5">
                  <h3 className="text-sm font-semibold text-red-500 uppercase tracking-wider mb-2">What Doesn&apos;t Work</h3>
                  <p className="text-foreground">{object?.designRoast?.whatDoesnt}</p>
                </Card>

                <Card className="p-6 border-l-4 border-l-green-500 bg-green-500/5">
                  <h3 className="text-sm font-semibold text-green-500 uppercase tracking-wider mb-2">What Works Well</h3>
                  <p className="text-foreground">{object?.designRoast?.whatWorks}</p>
                </Card>
              </div>
            )}
            
            {/* Copywriting */}
            {activeTab === 'copywriting' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold flex items-center gap-2"><FileText className="text-primary" /> Copywriting Analysis</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Marketing Framework</h3>
                    <p className="text-xl font-bold text-primary">{object?.copywriting?.marketingFramework}</p>
                  </Card>
                  <Card className="p-6">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Value Propositions</h3>
                    <ul className="space-y-2">
                      {object?.copywriting?.valuePropositions?.map((vp, i) => vp && <li key={i} className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> <span>{vp}</span></li>)}
                    </ul>
                  </Card>
                </div>
                
                <Card className="p-6 space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-green-500 uppercase tracking-wider mb-2">Why It Works</h3>
                    <p>{object?.copywriting?.whyItWorks}</p>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <h3 className="text-sm font-semibold text-red-500 uppercase tracking-wider mb-2">Weaknesses</h3>
                    <p>{object?.copywriting?.weaknesses}</p>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <h3 className="text-sm font-semibold text-blue-500 uppercase tracking-wider mb-2">Suggested Improvements</h3>
                    <p>{object?.copywriting?.improvements}</p>
                  </div>
                </Card>
              </div>
            )}

            {/* SEO Analysis */}
            {activeTab === 'seoAnalysis' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold flex items-center gap-2"><Search className="text-primary" /> SEO Analysis</h2>
                
                <Card className="p-8 mb-6 bg-card flex justify-center">
                  <ScoreCircle score={object?.seoAnalysis?.seoScore} label="Overall SEO Score" />
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Meta Title</h3>
                    <p className="font-medium">{object?.seoAnalysis?.metaTitle}</p>
                  </Card>
                  <Card className="p-6">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Meta Description</h3>
                    <p className="text-sm text-muted-foreground">{object?.seoAnalysis?.metaDescription}</p>
                  </Card>
                </div>

                <Card className="p-6">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Keyword Opportunities</h3>
                  <div className="flex flex-wrap gap-3">
                    {object?.seoAnalysis?.keywordOpportunities?.map((kw, i) => kw && <span key={i} className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-medium">{kw}</span>)}
                  </div>
                </Card>
              </div>
            )}

            {/* Competitors Fallback */}
            {['competitorAnalysis'].includes(activeTab) && (
              <Card className="p-8 text-center bg-card">
                <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Data Extracted</h3>
                <p className="text-muted-foreground">The {activeTab} data has been successfully analyzed and extracted.</p>
                <Button className="mt-6" variant="outline" onClick={() => copyToClipboard(JSON.stringify(object?.[activeTab as keyof typeof object], null, 2))}>
                  <Copy className="w-4 h-4 mr-2" /> Copy JSON Data
                </Button>
              </Card>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
