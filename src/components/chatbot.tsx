
"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { Bot, Send, User, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { queryFirebaseData } from "@/ai/flows/query-firebase-data";
import { cn } from "@/lib/utils";
import type { Message as GenkitMessage } from 'genkit';

interface DisplayMessage {
  role: "user" | "bot";
  content: React.ReactNode;
}

export function Chatbot() {
  const [displayMessages, setDisplayMessages] = useState<DisplayMessage[]>([]);
  const [history, setHistory] = useState<GenkitMessage[]>([]);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [displayMessages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input || isPending) return;

    const userDisplayMessage: DisplayMessage = { role: "user", content: input };
    setDisplayMessages((prev) => [...prev, userDisplayMessage]);

    const userHistoryMessage: GenkitMessage = { role: "user", content: [{ text: input }]};
    const newHistory = [...history, userHistoryMessage];

    setInput("");

    startTransition(async () => {
      const response = await queryFirebaseData({ 
        query: input,
        history: newHistory as any,
       });

      const botDisplayMessage: DisplayMessage = {
        role: "bot",
        content: (
          <div>
            <p className="mb-2">{response.results}</p>
            <details>
              <summary className="cursor-pointer text-sm text-muted-foreground">Show AI details</summary>
              <pre className="mt-2 p-2 bg-muted rounded-md text-xs font-code overflow-x-auto">
                <code>Tool Used: {response.firebaseQuery}</code>
              </pre>
            </details>
          </div>
        ),
      };
      setDisplayMessages((prev) => [...prev, botDisplayMessage]);

      const botHistoryMessage: GenkitMessage = { role: "model", content: [{ text: response.results }]};
      // Keep last 10 messages, user and model together
      setHistory((prev) => [...prev, userHistoryMessage, botHistoryMessage].slice(-10));
    });
  };

  return (
    <Card className="flex flex-col h-[60vh] w-full max-w-2xl mx-auto shadow-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Bot className="text-primary" />
          ProjectWise AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {displayMessages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-3",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "bot" && (
                  <div className="p-2 bg-primary rounded-full text-primary-foreground">
                    <Bot size={20} />
                  </div>
                )}
                <div
                  className={cn(
                    "p-3 rounded-lg max-w-sm",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {message.content}
                </div>
                 {message.role === "user" && (
                  <div className="p-2 bg-accent rounded-full text-accent-foreground">
                    <User size={20} />
                  </div>
                )}
              </div>
            ))}
             {isPending && (
              <div className="flex items-start gap-3 justify-start">
                <div className="p-2 bg-primary rounded-full text-primary-foreground">
                  <Bot size={20} />
                </div>
                <div className="p-3 rounded-lg bg-muted flex items-center">
                  <Loader2 className="animate-spin h-5 w-5 text-primary" />
                  <span className="ml-2">Thinking...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about tasks, progress, or team members..."
            disabled={isPending}
          />
          <Button type="submit" disabled={isPending || !input}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
