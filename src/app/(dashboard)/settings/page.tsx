'use client';

import { useState, useEffect } from 'react';
import { useConnectedUsername } from '@/hooks/use-connected-username';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useUser } from '@clerk/nextjs';
import { useTheme } from 'next-themes';
import {
  User,
  Save,
  Bot,
  Sun,
  Moon,
  Laptop,
  Trash2,
  Check,
  RefreshCw,
  Mail,
  Globe,
  ExternalLink,
  Code2,
} from 'lucide-react';
import { toast } from 'sonner';

const LANGUAGES = ['Python', 'C++', 'Java', 'JavaScript', 'TypeScript', 'Go', 'Rust', 'SQL'];

export default function SettingsPage() {
  const { user } = useUser();
  const { theme, setTheme } = useTheme();
  const { username, setConnectedUsername } = useConnectedUsername();

  const [inputUsername, setInputUsername] = useState('');
  const [preferredLang, setPreferredLang] = useState('Python');
  const [dailyTarget, setDailyTarget] = useState(3);
  const [explanationDepth, setExplanationDepth] = useState<'concise' | 'detailed'>('detailed');
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (username) setInputUsername(username);

    // Load saved local preferences
    const savedLang = localStorage.getItem('pref_language');
    const savedTarget = localStorage.getItem('pref_daily_target');
    const savedDepth = localStorage.getItem('pref_explanation_depth');

    if (savedLang) setPreferredLang(savedLang);
    if (savedTarget) setDailyTarget(Number(savedTarget));
    if (savedDepth) setExplanationDepth(savedDepth as 'concise' | 'detailed');
  }, [username]);

  function handleSaveProfile() {
    if (!inputUsername.trim()) {
      setConnectedUsername(null);
      toast.info('Disconnected LeetCode profile');
    } else {
      setConnectedUsername(inputUsername.trim());
      toast.success(`Connected profile @${inputUsername.trim()}`);
    }
  }

  function handleSavePreferences() {
    setSaving(true);
    localStorage.setItem('pref_language', preferredLang);
    localStorage.setItem('pref_daily_target', String(dailyTarget));
    localStorage.setItem('pref_explanation_depth', explanationDepth);

    setTimeout(() => {
      setSaving(false);
      toast.success('Preferences saved successfully!');
    }, 400);
  }

  function handleClearStudyPlanCache() {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith('study_plan_'));
    keys.forEach((k) => localStorage.removeItem(k));
    toast.success('Cleared local Study Plan cache');
  }

  function handleClearAIChatHistory() {
    localStorage.removeItem('leetflow_ai_chat_history');
    toast.success('Cleared AI Chat History');
  }

  function handleResetAllSettings() {
    localStorage.removeItem('pref_language');
    localStorage.removeItem('pref_daily_target');
    localStorage.removeItem('pref_explanation_depth');
    setPreferredLang('Python');
    setDailyTarget(3);
    setExplanationDepth('detailed');
    toast.info('Reset preferences to defaults');
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <PageHeader
        title="Settings & Preferences"
        description="Configure your LeetCode profile integration, AI Coach preferences, theme, and local cache."
      />

      {/* 1. LeetCode Profile Connection */}
      <Card className="border-border shadow-xs bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <User className="w-4 h-4 text-rose-500" />
            LeetCode Profile Connection
          </CardTitle>
          <CardDescription>
            Connect your public LeetCode username to automatically analyze weak topics and track progress.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="e.g. q0EfC7Dwsj"
              value={inputUsername}
              onChange={(e) => setInputUsername(e.target.value)}
              className="max-w-md bg-background"
            />
            <Button
              onClick={handleSaveProfile}
              className="bg-rose-500 hover:bg-rose-600 text-white gap-1.5 shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4" /> Connect Profile
            </Button>
          </div>
          {username && (
            <div className="flex items-center gap-2 text-xs text-emerald-500 font-medium bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg w-fit">
              <Check className="w-3.5 h-3.5" />
              Connected to @{username}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. Developer & Creator Info */}
      <Card className="border-rose-500/20 bg-rose-500/5 shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2 text-rose-500 dark:text-rose-400">
            <Code2 className="w-4 h-4" />
            Developer & Creator
          </CardTitle>
          <CardDescription>
            LeetFlow is designed and developed by Bhagya Majithiya. Connect via GitHub, LinkedIn, or Email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="mailto:thakkarbhagya65@gmail.com"
              className="flex items-center gap-1.5 text-xs font-medium bg-background border hover:border-rose-500/40 hover:text-rose-500 px-3 py-2 rounded-lg transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-rose-500" />
              thakkarbhagya65@gmail.com
            </a>
            <a
              href="https://github.com/BM1100"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium bg-background border hover:border-rose-500/40 hover:text-rose-500 px-3 py-2 rounded-lg transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-rose-500" />
              GitHub (@BM1100)
            </a>
            <a
              href="https://www.linkedin.com/in/bhagya-majithiya-05654336b"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium bg-background border hover:border-rose-500/40 hover:text-rose-500 px-3 py-2 rounded-lg transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-rose-500" />
              LinkedIn Profile
            </a>
          </div>
        </CardContent>
      </Card>

      {/* 3. AI Coach & Learning Preferences */}
      <Card className="border-border shadow-xs bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Bot className="w-4 h-4 text-rose-500" />
            AI Coach & Practice Settings
          </CardTitle>
          <CardDescription>
            Customize your preferred programming language and AI explanation depth.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Preferred Language */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
              Default Coding Language
            </label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setPreferredLang(lang)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all border cursor-pointer ${
                    preferredLang === lang
                      ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                      : 'bg-background hover:bg-muted text-muted-foreground border-border'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* AI Explanation Depth */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
              AI Explanation Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setExplanationDepth('concise')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  explanationDepth === 'concise'
                    ? 'border-rose-500 bg-rose-500/5 text-foreground'
                    : 'border-border bg-background hover:bg-muted/50 text-muted-foreground'
                }`}
              >
                <div className="font-semibold text-xs text-foreground mb-1">⚡ Concise & Direct</div>
                <div className="text-[11px] leading-relaxed">
                  Brief code solutions and essential Big-O takeaways for fast practice.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setExplanationDepth('detailed')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  explanationDepth === 'detailed'
                    ? 'border-rose-500 bg-rose-500/5 text-foreground'
                    : 'border-border bg-background hover:bg-muted/50 text-muted-foreground'
                }`}
              >
                <div className="font-semibold text-xs text-foreground mb-1">📚 Deep Step-by-Step Breakdown</div>
                <div className="text-[11px] leading-relaxed">
                  Detailed intuition, step-by-step logic, edge cases, and code walkthroughs.
                </div>
              </button>
            </div>
          </div>

          <Button
            onClick={handleSavePreferences}
            disabled={saving}
            className="bg-rose-500 hover:bg-rose-600 text-white gap-1.5 shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save Preferences
          </Button>
        </CardContent>
      </Card>

      {/* 4. Appearance & Theme */}
      <Card className="border-border shadow-xs bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Sun className="w-4 h-4 text-rose-500" />
            Appearance & Theme Mode
          </CardTitle>
          <CardDescription>
            Choose your preferred color theme for the app.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                mounted && theme === 'light'
                  ? 'border-rose-500 bg-rose-500/5 text-rose-500 dark:text-rose-400 font-semibold'
                  : 'border-border bg-background hover:bg-muted text-muted-foreground'
              }`}
            >
              <Sun className="w-5 h-5" />
              <span className="text-xs">Light</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                mounted && theme === 'dark'
                  ? 'border-rose-500 bg-rose-500/5 text-rose-500 dark:text-rose-400 font-semibold'
                  : 'border-border bg-background hover:bg-muted text-muted-foreground'
              }`}
            >
              <Moon className="w-5 h-5" />
              <span className="text-xs">Dark</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme('system')}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                mounted && theme === 'system'
                  ? 'border-rose-500 bg-rose-500/5 text-rose-500 dark:text-rose-400 font-semibold'
                  : 'border-border bg-background hover:bg-muted text-muted-foreground'
              }`}
            >
              <Laptop className="w-5 h-5" />
              <span className="text-xs">System</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* 5. Data Management & Storage */}
      <Card className="border-border shadow-xs bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-rose-500" />
            Data & Cache Management
          </CardTitle>
          <CardDescription>
            Manage locally cached data, saved study plans, chat history, and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={handleClearAIChatHistory} className="gap-1.5 text-xs text-rose-500 border-rose-500/20 hover:bg-rose-500/10 cursor-pointer">
            <Bot className="w-3.5 h-3.5" /> Clear AI Chat History
          </Button>
          <Button variant="outline" onClick={handleClearStudyPlanCache} className="gap-1.5 text-xs cursor-pointer">
            <RefreshCw className="w-3.5 h-3.5 text-rose-500" /> Clear Study Plan Cache
          </Button>
          <Button variant="outline" onClick={handleResetAllSettings} className="gap-1.5 text-xs text-destructive hover:bg-destructive/10 cursor-pointer">
            <Trash2 className="w-3.5 h-3.5" /> Reset Preferences
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
