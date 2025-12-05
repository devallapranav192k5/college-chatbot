from typing import List, Dict
import difflib

# Core FAQ knowledge (you can edit later for your college)
FAQ_DATA: List[Dict] = [
    {
        "q": "timetable",
        "a": (
            "You can check your timetable on the college portal → Academics → Timetable. "
            "If your college uses a different system, check with your department or class coordinator."
        ),
        "tags": ["timetable", "schedule", "period", "timing", "time table"],
    },
    {
        "q": "attendance rule",
        "a": (
            "Minimum required attendance is usually around 75% to be eligible for exams. "
            "Some colleges have subject-wise rules and may allow condonation up to a limit. "
            "Please confirm the exact percentage and condonation rules from your official handbook or portal."
        ),
        "tags": ["attendance", "attend", "shortage", "bunk", "percentage", "75", "%"],
    },
    {
        "q": "internal marks / cia",
        "a": (
            "Internal marks are typically calculated from mid-semester tests, assignments, quizzes, "
            "and lab performance. The exact weightage varies by college and course. "
            "You should refer to your syllabus copy or department circular for the exact breakup."
        ),
        "tags": ["internal", "cia", "sessional", "midsem", "assignment", "quiz"],
    },
    {
        "q": "exam schedule",
        "a": (
            "Exam schedules are usually posted on the Exam Cell section of the college website/portal "
            "and shared via official circulars. Always check the latest timetable and hall-ticket details there."
        ),
        "tags": ["exam", "schedule", "timetable", "dates", "hallticket", "hall ticket"],
    },
    {
        "q": "college fests and events",
        "a": (
            "College fests, tech events, and cultural programs are generally announced through notices, "
            "WhatsApp groups, and the college website or Instagram pages. "
            "For registration details, contact the respective event coordinators."
        ),
        "tags": ["fest", "event", "cultural", "techfest", "hackathon", "workshop"],
    },
]


def simple_keyword_search(query: str) -> str:
    """
    Smarter FAQ search:
    - Uses tags
    - Handles small spelling mistakes (e.g. 'attendace')
    """
    q_lower = query.lower()
    words = q_lower.split()

    best_match = None
    best_score = 0.0

    for faq in FAQ_DATA:
        score = 0.0
        for tag in faq["tags"]:
            tag_lower = tag.lower()

            # 1) direct substring match
            if tag_lower in q_lower:
                score += 1.0
                continue

            # 2) fuzzy match for small typos
            for w in words:
                ratio = difflib.SequenceMatcher(None, w, tag_lower).ratio()
                if ratio > 0.8:  # allow minor spelling mistakes
                    score += 0.8
                    break

        if score > best_score:
            best_score = score
            best_match = faq

    if best_match and best_score > 0:
        return best_match["a"]

    return "Sorry, I don't have information about that yet."
