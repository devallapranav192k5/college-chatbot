from pydantic import BaseModel
from typing import List, Optional, Any


class ChatRequest(BaseModel):
    user_id: Optional[str] = None
    message: str


class SourceMetadata(BaseModel):
    source_type: str
    title: str
    extra: Optional[Any] = None


class ChatResponse(BaseModel):
    reply: str
    intent: str
    sources: Optional[List[SourceMetadata]] = None
