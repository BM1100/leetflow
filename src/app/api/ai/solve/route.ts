import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { problemInput, language } = await req.json();

    if (!problemInput || typeof problemInput !== 'string' || problemInput.trim() === '') {
      return NextResponse.json({ error: 'Please provide a LeetCode problem number, title, or description.' }, { status: 400 });
    }

    const selectedLang = language || 'Python';

    const prompt = `You are an elite Data Structures & Algorithms (DSA) Expert and competitive programming coach.

Please provide the OPTIMAL solution for the following LeetCode problem:
"${problemInput.trim()}"

Target Programming Language: ${selectedLang}

Requirements:
1. Explain the core intuition and algorithm step-by-step.
2. Provide clean, idiomatic LeetCode class / function solution code in ${selectedLang}.
3. CRITICAL CODE FORMATTING RULE:
   - For C++ / C: Do NOT include redundant header includes like \`#include <bits/stdc++.h>\`, \`#include <vector>\`, \`#include <string>\`, or \`using namespace std;\`. Assume all standard headers and \`using namespace std;\` are already provided by the LeetCode environment. Start directly with the \`class Solution { ... };\` block or main function signature.
   - For Python / Java / JS / TS / Go / Rust / C#: Keep imports minimal and write concise LeetCode class/method code ready to paste directly into LeetCode's code editor.
4. Give exact Big-O Time and Auxiliary Space complexity with clear justifications.
5. List key edge cases and how the solution handles them.

Format your response cleanly in Markdown using these headings:
### 💡 Intuition & Approach
### ⚙️ Optimal Solution (${selectedLang})
### ⏱️ Complexity Analysis
### 🔍 Edge Cases`;

    const reply = await generateAIResponse([{ role: 'user', content: prompt }]);

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
