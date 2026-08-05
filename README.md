# ⚡ LeetFlow AI — Next-Gen AI Coding Coach & DSA Practice Platform

![LeetFlow Cover](https://img.shields.io/badge/LeetFlow-AI%20Coding%20Coach-rose)
![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss)
![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini%203.6%20Flash-8e44ad)
![Clerk Auth](https://img.shields.io/badge/Auth-Clerk-6c5ce7)

**LeetFlow** is a modern, AI-powered Data Structures & Algorithms (DSA) platform designed for competitive programmers and software engineering interview candidates. It connects with your official LeetCode profile to analyze your performance, generate optimal solutions in 9+ languages, audit line-by-line Big-O time and space complexity, and build progressive 7-day study roadmaps.

---

## 🌟 Key Features

* **⚡ AI Problem Solver**: Generates optimal code solutions in 9+ languages (Python, C++, Java, JS, TS, Go, Rust, C#, SQL) with step-by-step intuition and edge cases. Includes C++ optimization (omitting redundant headers for clean LeetCode submission).
* **⏱️ Line-by-Line Complexity Analyzer**: Deeply audits custom code snippets and outputs exact Big-O Time & Auxiliary Space complexity breakdowns.
* **🤖 Scoped AI DSA Coach**: An interactive AI mentor strictly dedicated to Data Structures, Algorithms, and Technical Interview prep.
* **📅 Progressive 7-Day Study Plans**: Generates structured 7-day pattern roadmaps across 48 official LeetCode topic tags with zero duplicate questions.
* **📊 Live LeetCode Profile Analytics**: Fetches live solved statistics (Easy, Medium, Hard breakdown), ranking, contribution points, recent accepted submissions, and topic skill tags directly via GraphQL.
* **🎨 Crimson Pulse Theme**: Modern dark-first UI styled with glassmorphism cards and smooth micro-animations.

---

## 🛠️ Technology Stack

* **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
* **Language**: [TypeScript](https://www.typescriptlang.org/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
* **AI Engine**: [Google Gemini AI API (`@google/genai`)](https://ai.google.dev/)
* **Authentication**: [Clerk Auth](https://clerk.com/)
* **Database & ORM**: [Prisma ORM](https://www.prisma.io/) & PostgreSQL

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/BM1100/leetflow.git
cd leetflow
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"

# Google Gemini AI
GEMINI_API_KEY="your_gemini_api_key"

# Database (Prisma)
DATABASE_URL="your_postgresql_database_url"
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view **LeetFlow**.

---

## 🌐 Deploy to Vercel

The easiest way to deploy LeetFlow is with [Vercel](https://vercel.com/new):

1. Push your code to GitHub.
2. Import your repository into Vercel.
3. Add your Environment Variables (`GEMINI_API_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `DATABASE_URL`).
4. Click **Deploy**!

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
