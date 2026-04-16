import React, { useState } from "react";

function App() {
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const sendMessage = async () => {
    if (!message) return;

    const userMessage = message;

    setChatHistory((prev) => [
      ...prev,
      { user: userMessage, ai: "" },
    ]);

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

      setFormData(data.structured_data || {});

      let aiText = data.summary
        ? data.summary
        : "Interaction logged successfully.";

      setChatHistory((prev) => [
        ...prev,
        { user: "", ai: aiText },
      ]);
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        { user: "", ai: "Error connecting to server" },
      ]);
    }
  };

  return (
    <div style={container}>
      
      {/* LEFT FORM */}
      <div style={card}>
        <h2 style={title}>Log HCP Interaction</h2>

        <Section title="Interaction Details">
          <Input label="HCP Name" value={formData.hcp_name} />
          
          <Row>
            <Input label="Date" value={formData.date} />
            <Input label="Time" value={formData.time} />
          </Row>

          <Textarea label="Topics Discussed" value={formData.discussion_topics} />
        </Section>

        <Section title="Sentiment">
          <div>
            <label><input type="radio" checked={formData.sentiment==="positive"} readOnly /> Positive</label>
            <label style={{marginLeft:10}}><input type="radio" checked={formData.sentiment==="neutral"} readOnly /> Neutral</label>
            <label style={{marginLeft:10}}><input type="radio" checked={formData.sentiment==="negative"} readOnly /> Negative</label>
          </div>
        </Section>

        <Section title="Materials Shared">
          <Input label="Materials" value={formData.materials_shared} />
        </Section>

        <Section title="Outcome & Follow-up">
          <Textarea label="Outcome" value={formData.outcome} />
          <Textarea label="Follow-up" value={formData.follow_up} />
        </Section>
      </div>

      {/* RIGHT CHAT */}
      <div style={chatCard}>
        <h3 style={title}>AI Assistant</h3>

        <div style={chatBox}>
          {chatHistory.length === 0 && (
            <p style={{color:"#888"}}>
              Try: "Met Dr. Smith, discussed product, positive meeting"
            </p>
          )}

          {chatHistory.map((chat, i) => (
            <div key={i} style={{marginBottom:10}}>
              {chat.user && <p><b>You:</b> {chat.user}</p>}
              {chat.ai && <p style={{color:"#2563eb"}}><b>AI:</b> {chat.ai}</p>}
            </div>
          ))}
        </div>

        <div style={{display:"flex", gap:10}}>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe interaction..."
            style={chatInput}
            onKeyDown={(e) => e.key==="Enter" && sendMessage()}
          />
          <button onClick={sendMessage} style={button}>
            Log
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= UI COMPONENTS ================= */

const Input = ({label, value}) => (
  <div style={{marginBottom:10}}>
    <label>{label}</label>
    <input value={value || ""} readOnly style={input} />
  </div>
);

const Textarea = ({label, value}) => (
  <div style={{marginBottom:10}}>
    <label>{label}</label>
    <textarea value={value || ""} readOnly style={input} />
  </div>
);

const Section = ({title, children}) => (
  <div style={{marginTop:15}}>
    <h4 style={{marginBottom:10, color:"#444"}}>{title}</h4>
    {children}
  </div>
);

const Row = ({children}) => (
  <div style={{display:"flex", gap:"5rem"}}>
    {children}
  </div>
);

/* ================= STYLES ================= */

const container = {
  display:"flex",
  gap:20,
  padding:20,
  background:"#f3f4f6",
  minHeight:"100vh",
  fontFamily:"Arial"
};

const card = {
  flex:2,
  background:"#fff",
  padding:20,
  borderRadius:10,
  boxShadow:"0 2px 8px rgba(0,0,0,0.1)"
};

const chatCard = {
  flex:1,
  background:"#fff",
  padding:20,
  borderRadius:10,
  boxShadow:"0 2px 8px rgba(0,0,0,0.1)",
  height: "100vh"
};

const title = {
  marginBottom:10
};

const input = {
  width:"100%",
  padding:8,
  border:"1px solid #ccc",
  borderRadius:5,
  marginTop:5
};

const chatBox = {
  height:"80vh",
  overflowY:"auto",
  border:"1px solid #ddd",
  borderRadius:8,
  padding:10,
  marginBottom:10,
  background:"#fafafa"
};

const chatInput = {
  flex:1,
  padding:8,
  borderRadius:5,
  border:"1px solid #ccc"
};

const button = {
  padding:"8px 16px",
  background:"#2563eb",
  color:"#fff",
  border:"none",
  borderRadius:5,
  cursor:"pointer"
};

export default App;