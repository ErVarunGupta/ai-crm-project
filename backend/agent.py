from langgraph.graph import StateGraph, END
from typing import TypedDict
from llm import llm
import json

current_interaction = {}

class AgentState(TypedDict):
    message: str
    structured_data: dict


def chatbot(state: AgentState):
    global current_interaction

    msg = state["message"]

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

    clean = ai_response.content.strip().replace("```json", "").replace("```", "")

    try:
        data = json.loads(clean)
    except:
        data = {}

    current_interaction = data

    return {
        "message": msg,
        "structured_data": current_interaction
    }


graph = StateGraph(AgentState)
graph.add_node("chatbot", chatbot)
graph.set_entry_point("chatbot")
graph.add_edge("chatbot", END)

app_graph = graph.compile()