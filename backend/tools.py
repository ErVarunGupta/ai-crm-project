from langchain_core.tools import tool

@tool
def log_interaction(input_text: str) -> dict:
    """
    Extract interaction details from user input and return structured data
    """
    return {
        "action": "log",
        "data": input_text
    }


@tool
def edit_interaction(input_text: str) -> dict:
    """
    Edit existing interaction fields based on user input
    """
    return {
        "action": "edit",
        "data": input_text
    }



@tool
def summarize_interaction(input_text: str) -> dict:
    """Summarize interaction details"""
    return {
        "action": "summarize",
        "message": "Summary generated"
    }


@tool
def suggest_followup(input_text: str) -> dict:
    """Suggest next follow-up action"""
    return {
        "action": "followup",
        "suggestion": "Schedule next meeting in 1 week"
    }


@tool
def fetch_history(input_text: str) -> dict:
    """Fetch previous interactions"""
    return {
        "action": "history",
        "data": "Previous interaction loaded"
    }