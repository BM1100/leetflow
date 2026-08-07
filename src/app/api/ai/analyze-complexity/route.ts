import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/gemini';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { code, language } = await req.json();

    if (!code || typeof code !== 'string' || code.trim() === '') {
      return NextResponse.json({ error: 'Please paste code to analyze.' }, { status: 400 });
    }

    const selectedLang = language || 'General / Auto';

    const prompt = `You are an expert Performance & Algorithmic Complexity Auditor.

Analyze the Time & Space Complexity of the following code snippet (${selectedLang}):

\`\`\`
${code}
\`\`\`

FORMAT INSTRUCTIONS:
- Keep the output CONCISE, COMPACT, and highly readable.
- Do NOT use LaTeX math symbols or dollar signs (NO $, NO $$, NO \\mathcal). Use clean standard notation like \`O(N)\`, \`O(N * 2^N)\`, or \`O(1)\`.
- Provide brief, direct bullet points instead of long paragraphs.

Format your output in clean Markdown:

### 📊 Complexity Overview
- **Time Complexity:** \`O(...)\` (Best / Worst case)
- **Space Complexity:** \`O(...)\` (Auxiliary vs Total)

### 🔬 Breakdown
- Bullet points detailing main loops, recursion depth, or memory usage.

### 🚀 Optimizations
- Short recommendations or confirmation if optimal.`;

    const reply = await generateAIResponse([{ role: 'user', content: prompt }]);
    return NextResponse.json({ analysis: reply });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
