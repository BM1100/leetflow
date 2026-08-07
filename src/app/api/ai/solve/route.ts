import { NextRequest } from 'next/server';
import { generateSolverStream } from '@/lib/gemini';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { problemInput, language } = await req.json();

    if (!problemInput || typeof problemInput !== 'string' || problemInput.trim() === '') {
      return new Response(
        JSON.stringify({ error: 'Please provide a LeetCode problem number, title, or description.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const selectedLang = language || 'Python';

    const prompt = `Solve the following LeetCode problem completely and without any truncation:
"${problemInput.trim()}"

Target Programming Language: ${selectedLang}

ABSOLUTE RULES — NEVER BREAK THESE:
- ALWAYS output the COMPLETE, FULLY WORKING code. Never stop mid-function or mid-class.
- NEVER truncate, abbreviate, or write "// ... rest of code". Write the full implementation.
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

    // Get Gemini streaming response
    const geminiStream = await generateSolverStream(prompt);

    // Pipe Gemini chunks directly to the HTTP response — bypasses Vercel timeout
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of geminiStream) {
            const text = chunk.text;
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } catch (err) {
          console.error('[Stream error]', err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-store',
        'X-Accel-Buffering': 'no',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (err: unknown) {
    const rawMessage = err instanceof Error ? err.message : String(err);
    const isQuota =
      rawMessage.includes('RESOURCE_EXHAUSTED') ||
      rawMessage.includes('429') ||
      rawMessage.includes('quota');
    const cleanMessage = isQuota
      ? 'Gemini API rate limit temporarily reached. Please wait 5-10 seconds and click Solve Problem again.'
      : rawMessage;

    return new Response(JSON.stringify({ error: cleanMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
