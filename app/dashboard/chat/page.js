"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  UserCircle, 
  Send, 
  Sparkles, 
  RotateCcw, 
  MoreHorizontal,
  Paperclip
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AIChatBot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content: "Hello Pooja! 👋 I'm your AI Career Coach. How can I help you with your interview prep or resume today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI Response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        role: "assistant",
        content: "That's a great question! Based on your profile, I recommend focusing on your React projects. Would you like me to analyze a specific job description for you?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="w-full h-[calc(100vh-120px)] flex flex-col font-sans animate-in fade-in duration-700">
      
      {/* 1. Chat Header */}
      <div className="flex items-center justify-between bg-white p-5 rounded-t-[2rem] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
              <Bot className="text-white w-6 h-6" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h2 className="text-lg font-black text-gray-800 tracking-tight uppercase">AI Coach</h2>
            <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Online & Ready to Help</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setMessages([messages[0]])} className="p-2.5 text-gray-400 hover:bg-gray-50 rounded-xl transition-colors">
            <RotateCcw className="w-5 h-5" />
          </button>
          <button className="p-2.5 text-gray-400 hover:bg-gray-50 rounded-xl transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50 scrollbar-hide"
      >
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center shadow-sm 
                  ${msg.role === "assistant" ? "bg-indigo-600 text-white" : "bg-white text-gray-400 border border-gray-100"}`}>
                  {msg.role === "assistant" ? <Bot size={16} /> : <UserCircle size={18} />}
                </div>
                <div>
                  <div className={`p-4 rounded-[1.5rem] text-sm font-medium shadow-sm leading-relaxed
                    ${msg.role === "user" 
                      ? "bg-indigo-600 text-white rounded-tr-none" 
                      : "bg-white text-gray-700 border border-gray-100 rounded-tl-none"}`}>
                    {msg.content}
                  </div>
                  <p className={`text-[10px] mt-1.5 font-bold text-gray-400 uppercase tracking-tighter ${msg.role === "user" ? "text-right" : "text-left"}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <div className="flex justify-start">
             <div className="bg-white px-4 py-3 rounded-2xl border border-gray-100 shadow-sm flex gap-1">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
             </div>
          </div>
        )}
      </div>

      {/* 3. Input Area */}
      <div className="p-5 bg-white rounded-b-[2rem] border-t border-gray-100">
        <form onSubmit={handleSendMessage} className="relative flex items-center gap-3">
          <button type="button" className="p-3 text-gray-400 hover:text-indigo-600 transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here..."
              className="w-full pl-5 pr-14 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-semibold"
            />
            <button 
              type="submit"
              disabled={!input.trim()}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all active:scale-95
                ${input.trim() ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "bg-gray-200 text-gray-400"}`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
        <p className="text-[10px] text-center mt-4 text-gray-400 font-bold uppercase tracking-[0.2em]">
          <Sparkles className="inline w-3 h-3 mb-0.5 mr-1 text-indigo-400" /> Powered by Advanced AI
        </p>
      </div>

    </div>
  );
};

export default AIChatBot;