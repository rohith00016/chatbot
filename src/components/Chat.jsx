// src/Chat.js

import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const apiKey = import.meta.env.VITE_API_KEY;

  const handleSend = async (message) => {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const chat = model.startChat({ history: [] });

      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "user", text: message },
      ]);

      const result = await chat.sendMessage(message);
      const response = result.response.text();

      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "bot", text: response },
      ]);
      setError("");
    } catch (error) {
      console.error("Error fetching response:", error);
      setError("Failed to fetch response. Please try again.");
    }
  };

  return (
    <div style={{ height: "500px", width: "400px", border: "1px solid black" }}>
      <ChatContainer>
        <MessageList>
          {messages.map((msg, index) => (
            <Message
              key={index}
              model={{ message: msg.text, direction: msg.type }}
            >
              {msg.text}
            </Message>
          ))}
        </MessageList>
        <MessageInput
          placeholder="Type your message here..."
          onSend={handleSend}
          sendButton={true}
        />
      </ChatContainer>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Chat;
