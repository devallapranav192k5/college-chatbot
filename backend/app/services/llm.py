from typing import Optional
from ..config import settings

_openai_client = None
_gemini_loaded = False


def _get_openai_client():
    global _openai_client
    if _openai_client is None:
        from openai import OpenAI
        if not settings.OPENAI_API_KEY:
            raise RuntimeError("OPENAI_API_KEY is not set.")
        _openai_client = OpenAI(api_key=settings.OPENAI_API_KEY)
    return _openai_client


def _init_gemini():
    global _gemini_loaded
    if not _gemini_loaded:
        import google.generativeai as genai
        if not settings.GEMINI_API_KEY:
            raise RuntimeError("GEMINI_API_KEY is not set.")
        genai.configure(api_key=settings.GEMINI_API_KEY)
        _gemini_loaded = True


def generate_llm_answer(user_query: str, faq_hint: Optional[str] = None) -> str:
    """
    Use OpenAI or Gemini depending on LLM_PROVIDER.
    """
    provider = settings.LLM_PROVIDER.lower()

    if provider == "openai":
        client = _get_openai_client()
        system_prompt = (
            "You are a helpful college assistant chatbot for students. "
            "Answer clearly and concisely. "
            "If you are not sure about exact college-specific rules, tell the student to confirm "
            "from the official portal or department office."
        )

        messages = [{"role": "system", "content": system_prompt}]
        if faq_hint:
            messages.append(
                {"role": "system", "content": f"Relevant college info: {faq_hint}"}
            )
        messages.append({"role": "user", "content": user_query})

        resp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            temperature=0.3,
        )
        return resp.choices[0].message.content

    elif provider == "gemini":
        _init_gemini()
        import google.generativeai as genai

        parts = [
            "You are a helpful college assistant chatbot for students.",
            "Answer clearly and concisely.",
        ]
        if faq_hint:
            parts.append(f"Relevant college info: {faq_hint}")
        parts.append(f"User question: {user_query}")

        model = genai.GenerativeModel("gemini-1.5-flash")
        result = model.generate_content("\n\n".join(parts))
        return result.text or "I could not generate a response."

    else:
        # faq_only mode – should not normally call this
        return faq_hint or "LLM is disabled (FAQ-only mode)."
