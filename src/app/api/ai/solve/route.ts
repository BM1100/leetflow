import { NextRequest, NextResponse } from 'next/server';
import { generateSolverResponse } from '@/lib/gemini';

// Increase Vercel serverless function timeout to 60 seconds
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { problemInput, language } = await req.json();

    if (!problemInput || typeof problemInput !== 'string' || problemInput.trim() === '') {
      return NextResponse.json({ error: 'Please provide a LeetCode problem number, title, or description.' }, { status: 400 });
    }

    const selectedLang = language || 'Python';

    const prompt = `You are an elite Data Structures & Algorithms (DSA) Expert and competitive programming coach.

Solve the following LeetCode problem completely and without any truncation:
"${problemInput.trim()}"

Target Programming Language: ${selectedLang}

ABSOLUTE RULES — NEVER BREAK THESE:
- ALWAYS output the COMPLETE, FULLY WORKING code. Never stop mid-function or mid-class. If the solution is long, write every single line.
- NEVER truncate, abbreviate, or write "// ... rest of code" or "// continue here". Write the full implementation.
- The CODE block must come FIRST before any explanation.

Code Formatting Rules:
- For C++ / C: Do NOT include #include<bits/stdc++.h>, #include<vector>, #include<string>, or "using namespace std;". Start directly with class Solution { }; or the function signature.
- For Python / Java / JS / TS / Go / Rust / C#: Minimal imports only. Write LeetCode-ready class/method code.

Format your response using EXACTLY these sections IN THIS ORDER:

### ⚙️ Optimal Solution (${selectedLang})
[Complete, fully working code here — no truncation allowed]

### 💡 Intuition & Approach
[Step-by-step explanation of the algorithm]

### ⏱️ Complexity Analysis
[Exact Big-O Time and Auxiliary Space with justification]

### 🔍 Edge Cases
[Key edge cases and how the solution handles them]`;

    const reply = await generateSolverResponse(prompt);

    if (!reply || reply.trim() === '') {
      return NextResponse.json({ error: 'AI generated an empty response. Please try clicking Solve again.' }, { status: 500 });
    }

    return NextResponse.json({ solution: reply });
  } catch (err: unknown) {
    const rawMessage = err instanceof Error ? err.message : String(err);
    const isQuota = rawMessage.includes('RESOURCE_EXHAUSTED') || rawMessage.includes('429') || rawMessage.includes('quota');
    const cleanMessage = isQuota
      ? 'Gemini API rate limit temporarily reached. Please wait 5-10 seconds and click Solve Problem again.'
      : rawMessage;

    return NextResponse.json({ error: cleanMessage }, { status: 500 });
  }
}
