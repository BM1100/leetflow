'use client';

import { useState, useRef, useEffect } from 'react';
import { useConnectedUsername } from '@/hooks/use-connected-username';
import { PageHeader } from '@/components/shared/page-header';
import { FormattedMarkdown } from '@/components/shared/formatted-markdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AI_SUGGESTIONS } from '@/types/ai';
import {
  Bot,
  User,
  Send,
  Loader2,
  Sparkles,
  Target,
  BookOpen,
  Lightbulb,
  Briefcase,
  HelpCircle,
  GraduationCap,
} from 'lucide-react';

interface ChatMsg {
  role: 'user' | 'assistant';
  content: string;
}

const ICON_MAP: Record<string, any> = {
  Target,
  BookOpen,
  Lightbulb,
  Briefcase,
  HelpCircle,
  GraduationCap,
};

export default function AICoachPage() {
  const { username } = useConnectedUsername();
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: 'assistant',
      content: `Hello! I'm your **LeetCode AI Coach**. ${
        username
          ? `I've loaded your performance stats for **@${username}**.`
          : 'Connect your LeetCode profile on the Dashboard for personalized feedback.'
      }\n\nHow can I help you prepare today? You can ask for weak topic analysis, problem recommendations, or concept explanations!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function sendMessage(textToSend?: string) {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const newMsgs: ChatMsg[] = [...messages, { role: 'user', content: text }];
    setMessages(newMsgs);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMsgs,
          username,
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error(`Server returned non-JSON response (${res.status}). Please try again.`);
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'AI generation failed');

      setMessages([...newMsgs, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages([
        ...newMsgs,
        {
          role: 'assistant',
          content: `⚠️ **Error**: ${err instanceof Error ? err.message : 'Failed to connect to AI Coach. Please check your Gemini API key.'}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-9.5rem)] min-h-[500px]">
      <PageHeader
        title="AI Coach"
        description={
          username
            ? `Personalized DSA mentor powered by Gemini AI (@${username})`
            : 'Personalized DSA mentor powered by Gemini AI'
        }
      />

      <div className="flex-1 border rounded-xl bg-card overflow-hidden flex flex-col shadow-xs mt-4 min-h-0">
        {/* Scrollable Messages List */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 min-h-0">
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`rounded-xl p-4 max-w-[85%] text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-rose-500 text-white rounded-br-none'
                      : 'bg-muted/60 border border-border text-foreground rounded-bl-none'
                  }`}
                >
                  <FormattedMarkdown content={msg.content} />
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-muted text-muted-foreground border flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 items-center text-muted-foreground text-sm py-2">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <span className="flex items-center gap-1.5 font-medium text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                  AI Coach is analyzing and writing...
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Suggestions Pills */}
        <div className="p-3 border-t bg-muted/20 overflow-x-auto flex gap-2 no-scrollbar">
          {AI_SUGGESTIONS.map((sug) => {
            const IconComponent = ICON_MAP[sug.icon] || Sparkles;
            return (
              <button
                key={sug.label}
                onClick={() => sendMessage(sug.prompt)}
                disabled={loading}
                className="flex items-center gap-1.5 text-xs bg-background hover:bg-rose-500/10 hover:text-rose-500 border rounded-full px-3 py-1.5 font-medium whitespace-nowrap transition-colors disabled:opacity-50"
              >
                <IconComponent className="w-3.5 h-3.5 text-rose-500" />
                <span>{sug.label}</span>
              </button>
            );
          })}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t flex gap-2 bg-card">
          <Input
            placeholder="Ask AI Coach anything about DSA, concepts, or problem strategies..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
            disabled={loading}
            className="flex-1 bg-background text-sm"
          />
          <Button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            className="bg-rose-500 hover:bg-rose-600 text-white shadow-xs"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
