from fastapi import FastAPI
from pydantic import BaseModel
from agent import app_graph
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS FIX
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dummy DB
database = []

memory = {}

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat(req: ChatRequest):
    global memory

    msg = req.message.lower()

    # SUMMARY
    if "summary" in msg:
        return {
            "message": req.message,
            "structured_data": memory,
            "summary": f"Interaction summary: {memory}"
        }

    result = app_graph.invoke({"message": req.message})

    memory = result.get("structured_data", {})

    # SAVE TO DB
    database.append(memory)

    return {
        "message": result.get("message"),
        "structured_data": memory
    }


@app.get("/data")
def get_data():
    return database