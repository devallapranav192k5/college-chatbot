import os
from typing import Optional

class Settings:
    PROJECT_NAME: str = "College Services Chatbot"

    # "openai", "gemini", or "faq_only"
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "faq_only")

    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY")
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY")


settings = Settings()

