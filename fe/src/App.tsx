import { useState, useRef } from "react";
import "./App.css";

type MessageI = string;

function App() {
  const ws = useRef<WebSocket | null>(null); // Avoid to be updated every time the component re-renders

  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState<MessageI>("");
  const [clientId, setClientId] = useState("");
  const [receivedMessages, setReceivedMessages] = useState<MessageI[]>([]);

  // Start WebSocket Connection
  function startConnection() {
    ws.current = new WebSocket(`ws://127.0.0.1:8000/ws/${clientId}`);

    // Connection opened
    ws.current.onopen = () => {
      setConnected(true);
      console.log("Connection opened");
    };

    // Receive messages from the server
    ws.current.onmessage = (event) => {
      console.log("onmessage", event.data);

      setReceivedMessages((prevMessages: MessageI[]) => [
        ...prevMessages,
        event.data,
      ]);
      setMessage(""); // Clear input form
    };

    // Handle WebSocket errors
    ws.current.onerror = (error) => {
      console.error("WebSocket error", error);
    };

    // Handle connection close
    ws.current.onclose = () => {
      console.log("Connection closed");
      setConnected(false);
    };
  }

  function sendMessage(e: any) {
    e.preventDefault();
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(message); // メッセージをサーバーに送信
      setMessage(""); // メッセージ送信後に入力をクリア
    } else {
      console.log("WebSocket is not connected.");
    }
  }

  return (
    <div className="container">
      <h1>WebSocket Example 💬</h1>

      <h2>Client ID: {clientId}</h2>
      <input
        type="text"
        value={clientId}
        onChange={(e) => setClientId(e.target.value)}
        style={{ width: 300 }}
        placeholder="Client ID"
      />

      <button
        style={{ backgroundColor: "#3596F3", color: "white" }}
        onClick={startConnection}
      >
        Connect
      </button>
      <h2>
        Connected: {connected ? "🥰 (ready to send me a love message!!)" : "😭"}
      </h2>

      <form onSubmit={(e) => sendMessage(e)} style={{ height: 40 }}>
        <input
          type="text"
          value={message}
          onInput={(e) => setMessage(e.target.value)}
          style={{ width: 300, height: "100%" }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: "#3596F3",
            color: "white",
            marginLeft: 10,
            height: "100%",
          }}
        >
          👋
        </button>
      </form>

      <h2>Received messages</h2>
      <ul>
        {receivedMessages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
