import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFormData } from "./store";

function App() {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.form);

  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const fetchDB = async () => {
    const res = await fetch("http://127.0.0.1:8000/data");
    const data = await res.json();
    console.log("DB DATA:", data);
    alert("Check console (F12) for DB data");
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;
    setMessage("");

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      dispatch(setFormData(data.structured_data || {}));

      const aiText = data.summary
        ? data.summary
        : `Interaction updated successfully`;

      setChatHistory((prev) => [...prev, { user: userMessage, ai: aiText }]);
    } catch {
      setChatHistory((prev) => [
        ...prev,
        { user: userMessage, ai: "Server error" },
      ]);
    }
  };

  return (
    <div style={container}>
      {/* LEFT PANEL */}
      <div style={card}>
        <h2 style={heading}>Log HCP Interaction</h2>

        <Section title="Interaction Details">
          <Input label="HCP Name" value={formData.hcp_name} />

          <div style={grid2}>
            <Input label="Date" value={formData.date} />
            <Input label="Time" value={formData.time} />
          </div>

          <Textarea
            label="Topics Discussed"
            value={formData.discussion_topics}
          />
        </Section>

        <Section title="Sentiment">
          <div style={radioGroup}>
            {["positive", "neutral", "negative"].map((s) => (
              <label key={s}>
                <input
                  type="radio"
                  checked={formData.sentiment === s}
                  readOnly
                />
                {s}
              </label>
            ))}
          </div>
        </Section>

        <Section title="Materials Shared">
          <Input label="Materials" value={formData.materials_shared} />
        </Section>

        <Section title="Outcome & Follow-up">
          <Textarea label="Outcome" value={formData.outcome} />
          <Textarea label="Follow-up" value={formData.follow_up} />
        </Section>

        <button onClick={fetchDB} style={button}>
          Show DB Data
        </button>
      </div>

      {/* RIGHT PANEL */}
      <div style={chatCard}>
        <h3 style={heading}>AI Assistant</h3>

        <div style={chatBox}>
          {chatHistory.length === 0 && (
            <p style={placeholder}>
              Try: "Met Dr. Sharma, discussed product, positive meeting"
            </p>
          )}

          {chatHistory.map((chat, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={userBubble}><b>You:</b> {chat.user}</div>
              <div style={aiBubble}><b>AI:</b> {chat.ai}</div>
            </div>
          ))}
        </div>

        <div style={chatInputBox}>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe interaction..."
            style={chatInput}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage} style={button}>
            Log
          </button>
        </div>
      </div>
    </div>
  );
}

/* COMPONENTS */

const Input = ({ label, value }) => (
  <div style={{ marginBottom: 12 }}>
    <label style={labelStyle}>{label}</label>
    <input value={value || ""} readOnly style={input} />
  </div>
);

const Textarea = ({ label, value }) => (
  <div style={{ marginBottom: 12 }}>
    <label style={labelStyle}>{label}</label>
    <textarea value={value || ""} readOnly style={input} />
  </div>
);

const Section = ({ title, children }) => (
  <div style={{ marginTop: 20 }}>
    <h4 style={sectionTitle}>{title}</h4>
    {children}
  </div>
);

/* STYLES */

const container = {
  display: "flex",
  gap: 20,
  padding: 20,
  background: "#eef2f7",
  minHeight: "100vh",
  fontFamily: "Inter, sans-serif",
};

const card = {
  flex: 2,
  background: "#fff",
  padding: 24,
  borderRadius: 12,
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const chatCard = {
  flex: 1,
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const heading = {
  marginBottom: 10,
};

const sectionTitle = {
  marginBottom: 10,
  color: "#444",
};

const labelStyle = {
  fontSize: 13,
  color: "#666",
};

const input = {
  width: "100%",
  padding: 10,
  marginTop: 4,
  borderRadius: 6,
  border: "1px solid #ddd",
  background: "#f9fafb",
};

const grid2 = {
  display: "flex",
  width: "100%",
  gap: "5rem",
};

const radioGroup = {
  display: "flex",
  gap: 15,
};

const chatBox = {
  height: "80vh",
  overflowY: "auto",
  border: "1px solid #eee",
  borderRadius: 10,
  padding: 12,
  marginBottom: 12,
  background: "#f9fafb",
};

const placeholder = {
  color: "#888",
};

const userBubble = {
  background: "#e0f2fe",
  padding: 8,
  borderRadius: 8,
  marginBottom: 5,
};

const aiBubble = {
  background: "#dbeafe",
  padding: 8,
  borderRadius: 8,
};

const chatInputBox = {
  display: "flex",
  gap: 10,
};

const chatInput = {
  flex: 1,
  padding: 10,
  borderRadius: 6,
  border: "1px solid #ddd",
};

const button = {
  padding: "10px 16px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

export default App;
