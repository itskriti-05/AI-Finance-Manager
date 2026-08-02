# FinWise

An AI-powered personal finance manager. Upload a bank statement and let a pipeline of agents categorize expenses, flag unusual spending, predict savings, build a monthly budget, and answer free-text finance questions.

## Pipeline
Upload statement → Statement parser → Category agent → MongoDB storage → Analysis agent → Budget agent → Q&A agent (tool-calling) → Dashboard

## Tech stack
- Frontend: React
- Backend: Node.js / Express
- Database: MongoDB (Atlas free tier)
- LLM: swappable, free-tier providers (Gemini / Groq)

## Setup
1. `cd backend && npm install`
2. Copy `.env.example` to `.env` and fill in your MongoDB URI and LLM API key
3. `npm run dev`

## Status
Work in progress - see commits for pipeline stage progress.
