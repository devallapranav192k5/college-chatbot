import google.generativeai as genai
from ..config import settings

# Configure Gemini with the safe settings variable
genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

def get_gemini_response(prompt: str) -> str:
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Gemini Error: {e}")
        return "I'm sorry, I'm having trouble connecting to my brain right now."