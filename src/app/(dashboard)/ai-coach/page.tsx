'use client';

import { useState, useRef, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useConnectedUsername } from '@/hooks/use-connected-username';
import { FormattedMarkdown } from '@/components/shared/formatted-markdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

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

const CHAT_STORAGE_KEY = 'leetflow_ai_chat_history';

export default function AICoachPage() {
  const { user } = useUser();
  const { username } = useConnectedUsername();
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load saved chat history from localStorage & Supabase
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(CHAT_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      } catch (err) {
        console.error('Failed to parse local chat history:', err);
      }
    }

    // Also fetch latest conversation from Supabase if logged in
    if (user?.id) {
      fetch('/api/user/sync')
        .then((res) => res.json())
        .then((data) => {
          if (data?.user?.latestConversation?.messages) {
            const dbMsgs = data.user.latestConversation.messages;
            if (Array.isArray(dbMsgs) && dbMsgs.length > 0) {
              setMessages(dbMsgs);
              localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(dbMsgs));
            }
          }
        })
        .catch((err) => console.warn('Supabase chat sync warning:', err));
    }

    if (!saved) {
      setMessages([
        {
          role: 'assistant',
          content: `Hello! I'm your **LeetCode AI Coach**. ${
            username
              ? `I've loaded your performance stats for **@${username}**.`
              : 'Connect your LeetCode profile on the Dashboard for personalized feedback.'
          }\n\nHow can I help you prepare today? You can ask for weak topic analysis, problem recommendations, or concept explanations!`,
        },
      ]);
    }
  }, [username, user?.id]);

  // Save to localStorage & Supabase DB on message updates
  useEffect(() => {
    if (mounted && messages.length > 0) {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));

      if (user?.id) {
        fetch('/api/user/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chatMessages: messages }),
        }).catch((err) => console.warn('Supabase post chat warning:', err));
      }
    }
  }, [messages, mounted, user?.id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  function clearChat() {
    localStorage.removeItem(CHAT_STORAGE_KEY);
    const defaultMsg: ChatMsg[] = [
      {
        role: 'assistant',
        content: `Chat history cleared! How can I assist you with your DSA practice today?`,
      },
    ];
    setMessages(defaultMsg);

    if (user?.id) {
      fetch('/api/user/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatMessages: defaultMsg }),
      }).catch((err) => console.warn('Supabase post chat warning:', err));
    }

    toast.success('AI Chat history cleared');
  }

  async function sendMessage(textToSend?: string) {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const newMsgs: ChatMsg[] = [...messages, { role: 'user', content: text }];
    setMessages(newMsgs);
    setInput(''); // Always clear input after sending
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
    <div className="flex flex-col h-[calc(100vh-7rem)] min-h-[560px]">
      {/* Header row — title + clear chat button together */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight">AI Coach</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {username
              ? `Personalized DSA mentor powered by Gemini AI (@${username})`
              : 'Personalized DSA mentor powered by Gemini AI'}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={clearChat}
          className="text-xs text-rose-500 border-rose-500/20 hover:bg-rose-500/10 gap-1.5 cursor-pointer flex-shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Chat
        </Button>
      </div>

      {/* Chat container */}
      <div className="flex-1 border rounded-xl bg-card overflow-hidden flex flex-col shadow-xs min-h-0">
        {/* Scrollable Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4 min-h-0">
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
                  className={`rounded-xl p-3.5 max-w-[85%] text-sm leading-relaxed ${
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
            <div ref={scrollRef} />
          </div>
        </div>

        {/* Suggestion Pills */}
        <div className="px-3 pt-2 pb-1 border-t bg-muted/20 overflow-x-auto flex gap-2 no-scrollbar">
          {AI_SUGGESTIONS.map((sug) => {
            const IconComponent = ICON_MAP[sug.icon] || Sparkles;
            return (
              <button
                key={sug.label}
                onClick={() => sendMessage(sug.prompt)}
                disabled={loading}
                className="flex items-center gap-1.5 text-xs bg-background hover:bg-rose-500/10 hover:text-rose-500 border rounded-full px-3 py-1.5 font-medium whitespace-nowrap transition-colors disabled:opacity-50 cursor-pointer"
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
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            disabled={loading}
            className="flex-1 bg-background text-sm"
          />
          <Button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="bg-rose-500 hover:bg-rose-600 text-white shadow-xs cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
