def classify_intent(text: str) -> str:
    """
    Improved rule-based intent detection.
    This is still simple, but more forgiving.
    """
    t = text.lower()

    # 1. Attendance-related (highest priority)
    attendance_keywords = [
        "attendance", "attend", "shortage", "present", "absent",
        "bunk", "percentage", "%"
    ]
    if any(k in t for k in attendance_keywords):
        return "attendance"

    # 2. Exam / marks
    exam_keywords = [
        "exam", "test", "marks", "midsem", "endsem",
        "internal", "cia", "result", "grade"
    ]
    if any(k in t for k in exam_keywords):
        return "exam_info"

    # 3. Timetable
    timetable_keywords = [
        "timetable", "schedule", "period", "timing", "time table"
    ]
    if any(k in t for k in timetable_keywords):
        return "timetable"

    # 4. Events / fests
    fest_keywords = ["fest", "event", "cultural", "hackathon", "workshop", "seminar"]
    if any(k in t for k in fest_keywords):
        return "events"

    return "general"
