from fastapi import FastAPI
from pydantic import BaseModel
from agent import app_graph
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 🔥 allow all (for dev)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

# 🔥 simple memory (shared with frontend)
memory = {}

@app.post("/chat")
async def chat(req: ChatRequest):
    global memory

    msg = req.message.lower().strip()

    # 🔥 SUMMARY (direct handling — guaranteed)
    if "summary" in msg:
        return {
            "message": req.message,
            "structured_data": memory,
            "summary": f"Interaction summary: {memory}"
        }

    # 🔥 call LangGraph for extraction/edit
    result = app_graph.invoke({"message": req.message})

    # update memory
    memory = result.get("structured_data", {})

    return {
        "message": result.get("message"),
        "structured_data": memory
    }