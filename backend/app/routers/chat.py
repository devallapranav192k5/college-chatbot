from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..services.llm import get_gemini_response

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/")
def chat_with_bot(request: ChatRequest):
    if not request.message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    
    # Send the user's message to Gemini
    bot_reply = get_gemini_response(request.message)
    
    return {"reply": bot_reply, "intent": "general"}