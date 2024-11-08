import { useState } from "react";
import "./App.css";
import useWebSocket, { ReadyState } from "react-use-websocket";

type MessageI = string;

function App() {
  const [clientId, setClientId] = useState("");
  const [message, setMessage] = useState<MessageI>("");
  const [receivedMessages, setReceivedMessages] = useState<MessageI[]>([]);

  // WebSocket URL based on clientId
  const socketUrl = clientId ? `ws://127.0.0.1:8000/ws/${clientId}` : null;

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    onOpen: () => {
      // get history
      console.log("Connection opened");
    },
    // Receive message
    onMessage: (event) => {
      console.log("onmessage", event.data);
      setReceivedMessages((prevMessages) => [...prevMessages, event.data]);
      setMessage(""); // Clear input form
    },
    onError: (error) => {
      console.error("WebSocket error", error);
    },
    onClose: () => {
      console.log("Connection closed");
    },
    shouldReconnect: () => true, // Automatically reconnect on disconnection
  });

  // Send message handler
  function handleSendMessage(e: any) {
    e.preventDefault();
    if (readyState === ReadyState.OPEN) {
      sendMessage(message);
      setMessage(""); // Clear input form
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
      <h2>
        Connected:{" "}
        {readyState === ReadyState.OPEN
          ? "🥰 (ready to send me a love message!!)"
          : "😭"}
      </h2>

      <form onSubmit={handleSendMessage} style={{ height: 40 }}>
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

      <h2>Last message</h2>
      <p>{lastMessage?.data}</p>

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
