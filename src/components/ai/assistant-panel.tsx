"use client";


import { usePathname } from "next/navigation";
import { Bot, X, Send, Sparkles } from "lucide-react";
import { useAssistantStore } from "@/stores/use-assistant-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";

export function AssistantPanel() {
  const { isOpen, toggle, setIsOpen } = useAssistantStore();
  const pathname = usePathname();
  
  // Extract tool slug for context if on a tool page
  const toolMatch = pathname?.match(/^\/tools\/([^/]+)$/);
  const toolSlug = toolMatch ? toolMatch[1] : null;

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { id: Date.now().toString(), role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, context: { toolSlug } }),
      });

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      if (data.text) {
        setMessages([...newMessages, { id: Date.now().toString(), role: "assistant", content: data.text }]);
      } else {
        const textResponse = await res.text();
        setMessages([...newMessages, { id: Date.now().toString(), role: "assistant", content: textResponse }]);
      }
    } catch {
      setMessages([...newMessages, { id: Date.now().toString(), role: "assistant", content: "Sorry, I encountered an error." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Floating Trigger Button
  if (!isOpen) {
    return (
      <button 
        onClick={toggle}
        className="fixed bottom-24 md:bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform hover:scale-110 active:scale-95"
        aria-label="Open AI Assistant"
      >
        <Sparkles className="h-6 w-6" />
      </button>
    );
  }

  return (
    <Card className="fixed bottom-24 md:bottom-6 right-6 z-50 flex h-[500px] w-[350px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">ToolHive AI</h3>
            <p className="text-[10px] text-muted-foreground">{toolSlug ? `Context: ${toolSlug}` : "Global Assistant"}</p>
          </div>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center space-y-3 opacity-70">
            <Bot className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground max-w-[200px]">
              Hi! I can help you use our tools or answer developer questions.
            </p>
          </div>
        )}
        
        {messages.map((m) => (
          <div 
            key={m.id} 
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                m.role === 'user' 
                  ? 'bg-primary text-primary-foreground rounded-br-sm' 
                  : 'bg-muted text-foreground rounded-bl-sm border border-border/50'
              }`}
            >
              <div className="whitespace-pre-wrap">{m.content}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-muted px-4 py-3 border border-border/50">
              <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '0ms' }} />
              <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '150ms' }} />
              <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-3">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input 
            value={input}
            onChange={handleInputChange}
            placeholder="Ask a question..."
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!input.trim() || isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}
