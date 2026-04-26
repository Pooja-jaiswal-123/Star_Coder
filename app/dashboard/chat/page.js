"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  ArrowUp,
  Paperclip,
  RefreshCcw
} from "lucide-react";

const AIChatBot = () => {
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const [messages, setMessages] = useState([
    {
      
  id: 1,
  role: "assistant",
  content:
    "Hello! I am your AI Career Coach. What would you like to talk about today? (Interview prep, Resume, or Career advice)",

    },
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTyping]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if ((!input.trim() && !selectedImage) || isTyping) return;

    const userText = input.trim();

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: userText || "Image sent",
      image: selectedImage ? URL.createObjectURL(selectedImage) : null,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSelectedImage(null);
    setIsTyping(true);

    const aiMessageId = Date.now() + 1;

    const aiPlaceholder = {
      id: aiMessageId,
      role: "assistant",
      content: "",
    };

    setMessages((prev) => [...prev, aiPlaceholder]);

    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
              {
                
            role: "system",
            content:
                    "You are a helpful, smart AI Career Coach. Default language must be English. Only reply in Hindi if the user writes in Hindi. If the user writes in English, always reply in English. Do not mix Hindi and English unless the user does it first. CRITICAL: DO NOT use markdown formatting like **bold**  or *italics*. Use plain text only.",

              },
              ...messages.map((msg) => ({
                role: msg.role,
                content: msg.content,
              })),
              {
                role: "user",
                content: userText || "User uploaded an image",
              },
            ],
            temperature: 0.7,
            max_tokens: 2048,
            stream: true,
          }),
        }
      );

      if (!response.ok) throw new Error("API response error");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let buffer = "";
      let completeResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();

        for (let line of lines) {
          line = line.trim();
          if (!line || line === "data: [DONE]") continue;

          if (line.startsWith("data: ")) {
            const jsonStr = line.substring(6);

            try {
              const parsed = JSON.parse(jsonStr);
              let content = parsed.choices[0]?.delta?.content || "";

              if (content) {
                content = content
                  .replace(/\*\*/g, "")
                  .replace(/\*/g, "");

                completeResponse += content;

                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === aiMessageId
                      ? { ...msg, content: completeResponse }
                      : msg
                  )
                );

                await new Promise((resolve) =>
                  setTimeout(resolve, 35)
                );
              }
            } catch (error) {
              console.error("Parsing error ignored:", error);
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat Error:", error);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? {
                ...msg,
                content:
                  "Sorry, network issue hai. Please try again.",
              }
            : msg
        )
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleResetChat = () => {
    setMessages([messages[0]]);
    setSelectedImage(null);
  };

  return (
    <div className="w-full h-screen bg-white flex flex-col items-center font-sans">
      {/* Header */}
      <div className="w-full h-14 flex items-center justify-between px-4 text-gray-700 border-b border-gray-100 shrink-0">
        <span className="font-semibold text-lg">AI Coach</span>

        <button
          onClick={handleResetChat}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors text-gray-500"
          title="New Chat"
        >
          <RefreshCcw size={18} />
        </button>
      </div>

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 w-full max-w-3xl overflow-y-auto px-4 py-8 space-y-8 scrollbar-hide"
      >
        {/* This heading will disappear after user types */}
        {messages.length === 1 && !input && (
          <div className="text-center text-2xl font-medium text-gray-400 mt-10">
            What’s on your mind today?
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${
              msg.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            {/* AI Message */}
            {msg.role === "assistant" && (
              <div className="flex gap-4 max-w-[90%]">
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot
                    size={18}
                    className="text-gray-700"
                  />
                </div>

                <div className="text-[15px] leading-relaxed text-gray-800 whitespace-pre-wrap pt-1 font-mono sm:font-sans">
                  {msg.content || (
                    <span className="w-2 h-4 bg-black inline-block animate-pulse"></span>
                  )}
                </div>
              </div>
            )}

            {/* User Message */}
            {msg.role === "user" && (
              <div className="bg-gray-100 px-5 py-3 rounded-3xl text-[15px] leading-relaxed text-gray-900 max-w-[80%]">
                {msg.content}

                {msg.image && (
                  <img
                    src={msg.image}
                    alt="uploaded"
                    className="mt-3 rounded-xl max-h-60"
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="w-full max-w-3xl px-4 pb-6 pt-2 bg-white">
        {selectedImage && (
          <div className="mb-3 text-sm text-gray-600">
            Selected: {selectedImage.name}
          </div>
        )}

        <form
          onSubmit={handleSendMessage}
          className="relative flex items-center bg-[#f4f4f4] rounded-[2rem] border border-transparent focus-within:border-gray-300 transition-colors"
        >
          {/* Hidden File Input */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageSelect}
            className="hidden"
          />

          {/* Image Upload Button */}
          <button
            type="button"
            onClick={handleImageClick}
            className="absolute left-3 p-2 text-gray-500 hover:text-black transition-colors rounded-full"
          >
            <Paperclip size={20} />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message AI Coach..."
            disabled={isTyping}
            className="w-full bg-transparent py-4 pl-12 pr-14 outline-none text-[15px] text-black disabled:opacity-50 placeholder:text-gray-500"
          />

          <button
            type="submit"
            disabled={
              (!input.trim() && !selectedImage) || isTyping
            }
            className={`absolute right-2 p-2 rounded-full transition-all flex items-center justify-center
              ${
                (input.trim() || selectedImage) &&
                !isTyping
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-gray-300 text-white"
              }`}
          >
            <ArrowUp size={20} strokeWidth={2.5} />
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-3">
          AI can make mistakes. Verify important career advice.
        </p>
      </div>
    </div>
  );
};

export default AIChatBot;