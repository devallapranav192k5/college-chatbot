import streamlit as st
import requests

API_URL = "http://127.0.0.1:8000/chat/"

st.set_page_config(
    page_title="College Chatbot",
    page_icon="🎓",
    layout="centered",
)

with st.sidebar:
    st.title("🎓 College Chatbot")
    st.markdown(
        """
        **Features**
        - Ask about timetable, attendance, exams, events  
        - Backend: FastAPI (Python)  
        - LLM: OpenAI / Gemini / FAQ-only  
        """
    )
    if st.button("🧹 Clear chat"):
        st.session_state.messages = []

st.markdown("## 🎓 College Services Chatbot")
st.write("Ask me anything related to your college. I'll try to help!")

if "messages" not in st.session_state:
    st.session_state.messages = []  # {role, content, intent?}


def send_to_backend(message: str):
    payload = {"message": message}
    resp = requests.post(API_URL, json=payload, timeout=20)
    resp.raise_for_status()
    return resp.json()


# show chat history
for msg in st.session_state.messages:
    role = msg["role"]
    content = msg["content"]
    intent = msg.get("intent")

    with st.chat_message("user" if role == "user" else "assistant"):
        st.markdown(content)
        if role == "assistant" and intent:
            st.caption(f"Intent: `{intent}`")


user_input = st.chat_input("Type your question here...")

if user_input:
    st.session_state.messages.append(
        {"role": "user", "content": user_input, "intent": None}
    )

    try:
        data = send_to_backend(user_input)
        bot_reply = data.get("reply", "I couldn't understand the response.")
        intent = data.get("intent", "unknown")
    except Exception as e:
        bot_reply = f"Error talking to backend: {e}"
        intent = None

    st.session_state.messages.append(
        {"role": "assistant", "content": bot_reply, "intent": intent}
    )
    st.rerun()
