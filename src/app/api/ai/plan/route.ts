import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { topics, username } = await req.json();

    if (!topics || !Array.isArray(topics) || topics.length === 0) {
      return NextResponse.json({ error: 'Topics array is required' }, { status: 400 });
    }

    const topicList = topics.join(', ');

    const prompt = `Create a 7-day LeetCode study plan for a developer focusing on topics: ${topicList}.

STRICT LEETCODE TAGGING & 30+ QUESTION CATEGORY RULE:
- Every algorithm and day in this plan MUST be tagged with an official LeetCode topic tag from this verified 30+ questions list:
  [Array, String, Hash Table, Math, Dynamic Programming, Sorting, Greedy, Depth-First Search, Binary Search, Database, Bit Manipulation, Matrix, Tree, Prefix Sum, Breadth-First Search, Two Pointers, Heap (Priority Queue), Simulation, Counting, Graph Theory, Binary Tree, Stack, Sliding Window, Enumeration, Design, Backtracking, Number Theory, Union-Find, Linked List, Segment Tree, Ordered Set, Monotonic Stack, Divide and Conquer, Combinatorics, Trie, Queue, Bitmask, Recursion, Geometry, Binary Indexed Tree, Hash Function, Memoization, Binary Search Tree, Shortest Path, Topological Sort, String Matching, Rolling Hash, Game Theory].

STRICT PROGRESSIVE DIFFICULTY REQUIREMENT:
Every day MUST cover a distinct LeetCode algorithm pattern, strictly increasing in difficulty:
- Day 1 (Easy): Basic warmup & fundamental concepts (e.g. Two Sum, Valid Anagram, Climbing Stairs, Combine Two Tables).
- Day 2 (Easy-Medium): Pattern application & core data structures.
- Day 3 (Medium): Standard interview patterns (e.g. 3Sum, Coin Change, Group Anagrams, House Robber).
- Day 4 (Medium): Intermediate interview-favorite problems (e.g. Course Schedule, Validate BST, Subarray Sum Equals K).
- Day 5 (Medium-Hard): Complex edge cases & multi-pattern combinations.
- Day 6 (Hard): Advanced algorithm problems (e.g. Edit Distance, Burst Balloons, Trapping Rain Water, Department Top Three Salaries).
- Day 7 (Hard Challenge): Top-tier Hard benchmark problems (e.g. Regular Expression Matching, Dungeon Game, Merge k Sorted Lists, Serialize and Deserialize Binary Tree, Median of Two Sorted Arrays, Largest Rectangle in Histogram).

For each problem, include:
- "name": Exact LeetCode problem title
- "slug": Exact LeetCode URL slug
- "difficulty": "Easy" | "Medium" | "Hard"
- "tag": Official LeetCode Topic Tag (e.g., "${topics[0] || 'Array'}")

Return ONLY a valid JSON array of 7 objects conforming strictly to this format:
[
  {
    "day": 1,
    "title": "Day 1: Easy Warmup (${topics[0] || 'Array'})",
    "topic": "${topics[0] || 'Array'}",
    "focus": "Focus overview for today",
    "problems": [
      { "name": "Two Sum", "slug": "two-sum", "difficulty": "Easy", "tag": "${topics[0] || 'Array'}" }
    ]
  }
]`;

    try {
      const jsonText = await generateAIResponse([{ role: 'user', content: prompt }]);
      return NextResponse.json({ reply: jsonText });
    } catch (aiErr) {
      console.warn('AI plan generation rate limited, client fallback will handle:', aiErr);
      return NextResponse.json({ reply: '' });
    }
  } catch (err: unknown) {
    const rawMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: rawMessage }, { status: 500 });
  }
}
