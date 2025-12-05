from typing import List, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from .knowledge_base import COLLEGE_DOCS
from .faq_data import simple_keyword_search

# Build TF-IDF index once
_DOC_TEXTS = [doc["content"] for doc in COLLEGE_DOCS]
_VECTOR = TfidfVectorizer(stop_words="english")
_DOC_MATRIX = _VECTOR.fit_transform(_DOC_TEXTS)


def _retrieve_docs(query: str, top_k: int = 2) -> List[Tuple[float, dict]]:
    """
    Return top_k documents with cosine similarity scores.
    """
    q_vec = _VECTOR.transform([query])
    sims = cosine_similarity(q_vec, _DOC_MATRIX)[0]
    scored = sorted(
        zip(sims, COLLEGE_DOCS),
        key=lambda x: x[0],
        reverse=True,
    )
    return scored[:top_k]


def answer_with_rag_style(query: str):
    """
    RAG-style answer:
    - Retrieve relevant docs from COLLEGE_DOCS using TF-IDF.
    - Compose a short answer using the top doc.
    - Also use FAQ search as a backup.
    """
    retrieved = _retrieve_docs(query, top_k=2)
    best_score, best_doc = retrieved[0]

    base_answer = best_doc["content"]

    # Also get FAQ answer as a short summary / fallback
    faq_answer = simple_keyword_search(query)

    # Choose which to show as primary text (for FAQ-only mode)
    # For now: FAQ if it is not generic, else doc content
    if "don't have information" not in faq_answer.lower():
        primary = faq_answer
    else:
        primary = base_answer

    sources = [
        {
            "source_type": "doc",
            "title": best_doc["title"],
            "extra": {"similarity": float(best_score)},
        }
    ]

    return primary, sources
