# Core AI // Intelligent Academic Operating System

[![Live Demo](https://img.shields.io/badge/Live_Demo-Online-success?style=for-the-badge&logo=vercel)](https://college-chatbot-five.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-Black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

> **Live Application:** [https://college-chatbot-five.vercel.app/](https://college-chatbot-five.vercel.app/)

## Overview
Core AI is a scalable, database-driven B2B SaaS platform designed to act as a personal academic and professional operating system for university students. 

Moving beyond standard FAQ chatbots, this platform integrates a real-time, streaming Large Language Model (Gemini 2.5 Flash) with live PostgreSQL database metrics. The AI acts as a dynamic mentor—analyzing grades, forecasting CGPA, managing financial dues, and tracking internship pipelines, all rendered through an interactive, cinematic Next.js user interface.

## 📸 Interface Preview
<img width="1838" height="847" alt="Screenshot 2026-06-06 115042" src="https://github.com/user-attachments/assets/52d425e0-0193-4992-89f2-64a037c140b4" />


https://github.com/user-attachments/assets/347cb1e9-55dc-4dde-8f2c-f16dec3a4925






## 🚀 Core Architecture & Tech Stack
This application is built on a modern, decoupled microservices architecture.

### Frontend: Client UI (Deployed on Vercel)
* **Framework:** Next.js / React 
* **Styling:** Tailwind CSS (Custom dark-mode UI with frosted glass/backdrop-blur effects)
* **Rendering Engine:** `react-markdown` with `remark-math` and `rehype-katex` for real-time formatting of LaTeX math formulas and AI-generated UI tags.
* **Dynamic Interceptors:** Custom component dispatchers that read AI JSON payloads and render interactive widgets (Calculators, Career Funnels, Attendance Simulators) mid-conversation.

### Backend: AI Engine (Deployed on Render)
* **Framework:** Python / FastAPI
* **LLM Engine:** Google Generative AI (`gemini-2.5-flash`) utilizing asynchronous streaming (`GenerativeModel.generate_content_async`).
* **Database:** Supabase (PostgreSQL)
* **Security:** Configured for multi-tenant Row Level Security (RLS) via JWT authentication to ensure strict data isolation between student profiles.

## ⚡ Key Features (Phase 1)
- **High-Speed AI Streaming:** Real-time token generation for zero-latency conversational UI.
- **Context-Aware Mentorship:** The LLM is system-prompted with the user's live database metrics (CGPA, attendance, application statuses) to provide hyper-personalized advice.
- **Interactive Widgets:** - 📊 **Attendance Simulator:** Safely calculate class misses against a 75% minimum requirement.
  - 📈 **CGPA Forecaster:** Interactive sliders to project end-of-semester standing based on current credits.
  - 💼 **Career Funnel:** Visual tracking of tech applications, interviews, and offers.
  - 💸 **Financial Dashboard:** Real-time tracking of pending university dues.

## 🛠️ Local Installation
To run this project locally, you will need Node.js, Python 3.10+, and a Supabase account.

**1. Clone the repository**
```bash
git clone [https://github.com/devallapranav192k5/college-chatbot.git](https://github.com/devallapranav192k5/college-chatbot.git)
cd college-chatbot

2. Boot the AI Backend
cd backend
python -m venv venv
source venv/bin/activate  # Or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

3. Boot the Frontend UI
cd frontend
npm install
npm run dev

Engineered by Devalla Pranav.
