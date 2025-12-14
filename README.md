# AI-Powered College Services Chatbot

A full-stack AI-based college assistant chatbot designed to help students quickly access academic information such as attendance rules, exam details, timetables, and college events through natural-language queries.

The system is deployed on the cloud and accessible from any device via a live web interface.

Live Demo:
https://college-chatbot-dlcmyyewfa2zjxz6p4raul.streamlit.app/

Project Overview

This project follows a clean frontend–backend architecture:

A Streamlit-based chat interface allows users to ask questions in natural language.

A FastAPI backend processes requests using:

Intent classification

FAQ-based reasoning

Knowledge-base retrieval (RAG-style)

The system is designed to avoid hallucinations by prioritizing verified academic information, with optional LLM integration.

Key Features

Natural language chatbot for college-related queries

Intent detection (attendance, exams, timetable, events, general info)

Knowledge-base & FAQ retrieval using TF-IDF similarity

Modular architecture with optional OpenAI / Gemini LLM support

Fully deployed and publicly accessible

Auto-generated API documentation (Swagger)
