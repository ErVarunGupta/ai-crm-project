from langgraph.graph import StateGraph, END
from typing import TypedDict
from llm import llm
from tools import (
    log_interaction,
    edit_interaction,
    summarize_interaction,
    suggest_followup,
    fetch_history
)
import json

# ==============================
# 🧠 GLOBAL MEMORY
# ==============================
current_interaction = {}

print("🔥 THIS AGENT FILE IS RUNNING 🔥")


class AgentState(TypedDict):
    message: str
    structured_data: dict


def chatbot(state: AgentState):
    global current_interaction

    msg = state["message"]
    msg_lower = msg.lower().strip()

    print("USER:", msg_lower)

    action = "log"
    extra = {}

    # ==============================
    # 🧠 SUMMARY (IMPORTANT FIX)
    # ==============================
    if "summary" in msg_lower:
        print("🔥 SUMMARY HIT 🔥")

        return {
            "message": msg,
            "structured_data": current_interaction,
            "action": "summary",
            "extra": {
                "summary": f"Interaction summary: {current_interaction}"
            }
        }

    # ==============================
    # TOOL DECISION
    # ==============================

    if "change" in msg_lower or "edit" in msg_lower:
        action = "edit"
        tool_result = edit_interaction.invoke(msg)

    elif "follow" in msg_lower:
        action = "followup"
        tool_result = suggest_followup.invoke(msg)

        extra["suggestion"] = "Recommended follow-up: Schedule next meeting in 1 week"

    elif "history" in msg_lower:
        action = "history"
        tool_result = fetch_history.invoke(msg)

        extra["history"] = current_interaction

    else:
        tool_result = log_interaction.invoke(msg)

    # ==============================
    # ONLY EXTRACT WHEN NEEDED
    # ==============================

    if action in ["log", "edit"]:

        prompt = f"""
Extract CRM data as JSON.

Fields:
- hcp_name
- date
- time
- discussion_topics
- sentiment
- materials_shared
- outcome
- follow_up

User Input:
{msg}

Return ONLY JSON.
"""

        ai_response = llm.invoke(prompt)

        clean_response = ai_response.content.strip()

        if clean_response.startswith("```"):
            clean_response = clean_response.replace("```json", "").replace("```", "").strip()

        try:
            new_data = json.loads(clean_response)
        except:
            new_data = {}

        if action == "edit":
            current_interaction.update({k: v for k, v in new_data.items() if v})
        else:
            current_interaction = new_data

    # ==============================
    # FINAL RETURN
    # ==============================

    response = {
        "message": msg,
        "structured_data": current_interaction,
        "action": action
    }

    response.update(extra)

    return response


# ==============================
# 🔗 LANGGRAPH SETUP
# ==============================

graph = StateGraph(AgentState)

graph.add_node("chatbot", chatbot)
graph.set_entry_point("chatbot")
graph.add_edge("chatbot", END)

app_graph = graph.compile()