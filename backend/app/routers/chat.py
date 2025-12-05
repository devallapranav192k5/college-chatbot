from fastapi import APIRouter
from ..schemas import ChatRequest, ChatResponse, SourceMetadata
from ..services.intent import classify_intent
from ..services.rag import answer_with_rag_style
from ..services.llm import generate_llm_answer
from ..config import settings

router = APIRouter()


@router.post("/", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    intent = classify_intent(req.message)

    # RAG: get best answer from docs + FAQ
    rag_answer, raw_sources = answer_with_rag_style(req.message)
    sources = [SourceMetadata(**s) for s in raw_sources]

    provider = settings.LLM_PROVIDER.lower()

    if provider == "faq_only":
        reply_text = rag_answer
    else:
        try:
            reply_text = generate_llm_answer(req.message, faq_hint=rag_answer)
        except Exception:
            # Soft fallback – user never sees ugly error
            reply_text = rag_answer + "\n\n(Note: AI model unavailable, showing internal information only.)"

    return ChatResponse(
        reply=reply_text,
        intent=intent,
        sources=sources,
    )

