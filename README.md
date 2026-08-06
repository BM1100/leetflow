# ⚡ LeetFlow AI — Next-Gen AI Coding Coach & DSA Practice Platform

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live%20Demo-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://leetflow.vercel.app)
[![LeetFlow Cover](https://img.shields.io/badge/LeetFlow-AI%20Coding%20Coach-rose?style=for-the-badge)](https://leetflow.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini%203.6%20Flash-8e44ad?style=for-the-badge)](https://ai.google.dev/)
[![Supabase](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ecf8e?style=for-the-badge&logo=supabase)](https://supabase.com)

🔗 **Live Production Demo**: [https://leetflow.vercel.app](https://leetflow-ruby.vercel.app/)

**LeetFlow** is a modern, AI-powered Data Structures & Algorithms (DSA) platform designed for competitive programmers and software engineering interview candidates. It connects with your official LeetCode profile to analyze your performance, generate optimal solutions in 9+ languages, audit line-by-line Big-O time and space complexity, build progressive 7-day study roadmaps, and synchronize user data across all devices via Supabase PostgreSQL.

---

## 👨‍💻 Developer & Maintainer

Designed and developed with ❤️ by **Bhagya Majithiya**.

* **📧 Email**: [thakkarbhagya65@gmail.com](mailto:thakkarbhagya65@gmail.com)
* **🐙 GitHub**: [@BM1100](https://github.com/BM1100)
* **💼 LinkedIn**: [Bhagya Majithiya](https://www.linkedin.com/in/bhagya-majithiya-05654336b)

---

## 🌟 Key Features

* **⚡ AI Problem Solver**: Generates optimal code solutions in 9+ languages (Python, C++, Java, JS, TS, Go, Rust, C#, SQL) with step-by-step intuition and edge cases. Includes C++ optimization (omitting redundant headers for clean LeetCode submission).
* **⏱️ Line-by-Line Complexity Analyzer**: Deeply audits custom code snippets and outputs exact Big-O Time & Auxiliary Space complexity breakdowns.
* **🤖 Scoped AI DSA Coach**: An interactive AI mentor strictly dedicated to Data Structures, Algorithms, and Technical Interview prep, featuring persistent chat history and clear chat capabilities.
* **📅 Progressive 7-Day Study Plans**: Generates structured 7-day pattern roadmaps across 48 official LeetCode topic tags with zero duplicate questions and interactive problem completion checkboxes.
* **📊 Live LeetCode Profile Analytics**: Fetches live solved statistics (Easy, Medium, Hard breakdown), ranking, contribution points, recent accepted submissions, and top 12 topic skill tags directly via GraphQL.
* **🔄 Supabase Cross-Device Sync**: Automatically synchronizes your connected LeetCode profile, study plans, checked question progress, and AI chat history across mobile and desktop devices.
* **🎨 Crimson Pulse Theme**: Modern dark-first UI styled with glassmorphism cards, dynamic theme-adapting text, and smooth micro-animations.

---

## 🛠️ Technology Stack

* **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
* **Language**: [TypeScript](https://www.typescriptlang.org/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
* **AI Engine**: [Google Gemini AI API (`@google/genai`)](https://ai.google.dev/)
* **Authentication**: [Clerk Auth](https://clerk.com/)
* **Database & ORM**: [Prisma ORM](https://www.prisma.io/) & [Supabase PostgreSQL](https://supabase.com)

---

## 🌐 Live Deployment & Demo

View the live production application deployed on Vercel:
👉 **[https://leetflow.vercel.app](https://leetflow-ruby.vercel.app/)**

---

## 🚀 Getting Started Locally

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

# Database (Prisma / Supabase)
DATABASE_URL="your_postgresql_database_url"
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view **LeetFlow**.

---


