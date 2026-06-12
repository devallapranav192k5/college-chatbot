import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from supabase import create_client, Client
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Core AI Platform", version="2.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = os.getenv("GEMINI_API_KEY", "YOUR_GEMINI_API_KEY")
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('gemini-2.5-flash')

SUPABASE_URL = os.getenv("SUPABASE_URL", "YOUR_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "YOUR_SUPABASE_KEY")

try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
except Exception:
    supabase = None

class ChatRequest(BaseModel):
    messages: list

class SyncRequest(BaseModel):
    attendance_percentage: float = None
    current_cgpa: float = None

def get_student_data():
    default_data = {
        "attendance_percentage": 82.5,
        "total_classes": 100,
        "current_cgpa": 8.4,
        "credits_earned": 42,
        "account_balance": 15000,
        "pending_dues": 22500,
        "applications": 12,
        "interviews": 3,
        "offers": 1
    }
    if supabase:
        try:
            res = supabase.table("student_profiles").select("*").limit(1).execute()
            if res.data:
                return res.data[0]
        except Exception:
            pass
    return default_data

@app.post("/api/sync-data")
async def sync_data(request: SyncRequest):
    if not supabase:
        return {"status": "offline"}
    try:
        update_payload = {}
        if request.attendance_percentage is not None:
            update_payload["attendance_percentage"] = request.attendance_percentage
        if request.current_cgpa is not None:
            update_payload["current_cgpa"] = request.current_cgpa
            
        if update_payload:
            res = supabase.table("student_profiles").select("id").limit(1).execute()
            if res.data:
                supabase.table("student_profiles").update(update_payload).eq("id", res.data[0]["id"]).execute()
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    if not request.messages:
        raise HTTPException(status_code=400, detail="Empty sequence.")
    
    user_query = request.messages[-1]["content"].lower()
    student = get_student_data()

    # THE UPGRADED SYSTEM PROMPT (Strict Formatting Rules)
    system_context = f"""
    SYSTEM INSTRUCTIONS:
    You are Core AI, an advanced, highly intelligent personal academic assistant for Devalla Pranav.
    Act like a sharp, insightful human mentor. 
    
    FORMATTING RULES (CRITICAL):
    1. NEVER output a wall of text. Break your responses into short, punchy paragraphs.
    2. Use Markdown styling to make your response visually engaging:
       - Use "### " for section headings.
       - Use "**" to bold critical terms, metrics, and actionable advice.
       - Use numbered lists or bullet points to break down strategies.
    3. Maintain a dynamic, engaging, and confident tone. Don't be dull.
    
    Here is Devalla's live academic data:
    - Current CGPA: {student.get("current_cgpa", 8.4)}
    - Total Credits: {student.get("credits_earned", 42)}
    - Attendance: {student.get("attendance_percentage", 82)}%
    - Pending Dues: ₹{student.get("pending_dues", 22500)}
    - Pipeline: {student.get("applications", 12)} applications, {student.get("interviews", 3)} interviews.
    """

    async def generate_response():
        widget_payload = ""
        if "miss" in user_query or "attendance" in user_query:
            widget_payload = f'\n\n||WIDGET_DATA:{{"type":"SIMULATOR","data":{{"current":{student.get("attendance_percentage", 82)},"total":{student.get("total_classes", 100)},"required":75,"missed":0}}}}||'
        elif "gpa" in user_query or "calculate" in user_query:
            widget_payload = f'\n\n||WIDGET_DATA:{{"type":"CALCULATOR","data":{{"current_cgpa":{student.get("current_cgpa", 8.4)},"credits":{student.get("credits_earned", 42)}}}}}||'
        elif "internship" in user_query or "application" in user_query:
            widget_payload = f'\n\n||WIDGET_DATA:{{"type":"PIPELINE","data":{{"applications":{student.get("applications", 12)},"interviews":{student.get("interviews", 3)},"offers":{student.get("offers", 1)},"status":"ACTIVE"}}}}||'
        elif "skill" in user_query or "learn" in user_query:
            widget_payload = '\n\n||WIDGET_DATA:{"type":"SKILL_TREE","data":{"current_node":"Data Science Integration","unlocked":["Python","AES/RSA Cryptography","Web Applications"],"locked":["Marketing Channel Information System (MCIS)","Association Rule Mining (T1-T8)"]}}||'
        elif "fee" in user_query or "due" in user_query:
            widget_payload = f'\n\n||WIDGET_DATA:{{"type":"FINANCE","data":{{"balance":{student.get("account_balance", 15000)},"dues":{student.get("pending_dues", 22500)},"next_deadline":"Oct 15th"}}}}||'

        try:
            full_prompt = f"{system_context}\n\nUSER QUERY:\n{request.messages[-1]['content']}"
            response = await model.generate_content_async(full_prompt, stream=True)
            
            async for chunk in response:
                try:
                    if chunk.candidates and chunk.candidates[0].content.parts:
                        text = chunk.text
                        if text: yield text
                except Exception: continue
            
            if widget_payload: yield widget_payload
        except Exception as e:
            yield f"\n[System Error: {str(e)}]"

    return StreamingResponse(generate_response(), media_type="text/plain")