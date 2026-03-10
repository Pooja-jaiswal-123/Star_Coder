"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Groq from "groq-sdk";
import ReactMarkdown from 'react-markdown';
import { Send, Bot, User, Loader2, Trash2, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY , 
  dangerouslyAllowBrowser: true 
});

export default function FormalChat() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Welcome to the **Groq AI Interface**. How may I assist you with your professional tasks today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [...messages, userMsg],
        model: "llama-3.3-70b-versatile",
        temperature: 0.5,
      });

      const aiResponse = chatCompletion.choices[0]?.message?.content || "An error occurred.";
      setMessages((prev) => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', content: "**System Error:** Connection failed." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[85vh] w-full max-w-5xl mx-auto bg-white border border-slate-200 shadow-2xl rounded-xl overflow-hidden my-8 font-sans antialiased">
      
      {/* --- NEW STYLISH HEADER --- */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 px-6 py-5 flex justify-between items-center shadow-lg relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        
        <div className="flex items-center gap-6 relative z-10">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-all text-sm font-medium bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-sm"
          >
            <ArrowLeft size={16} />
            Exit
          </button>
          
          <div className="h-6 w-[1px] bg-white/20" />

          <div className="flex items-center gap-3">
            <div className="bg-indigo-500/20 p-2 rounded-lg border border-indigo-400/30">
              <Sparkles size={20} className="text-indigo-300" />
            </div>
            <div>
              <h1 className="font-bold text-white tracking-tight leading-none">AI Research Engine</h1>
              <p className="text-[10px] text-indigo-300 uppercase tracking-[0.2em] font-bold mt-1">Enterprise Edition</p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setMessages([{ role: 'assistant', content: 'Conversation reset. Ready for new inquiries.' }])}
          className="text-slate-400 hover:text-red-400 p-2.5 transition-all rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10"
          title="Reset Session"
        >
          <Trash2 size={20} />
        </button>
      </div>
      {/* --------------------------- */}

      {/* Structured Chat Area */}
      <div className="flex-1 overflow-y-auto bg-[#fcfcfd] p-8 space-y-8">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-4 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border-2 shadow-sm ${
                msg.role === 'user' ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-100 text-indigo-600'
              }`}>
                {msg.role === 'user' ? <User size={20} className="text-white" /> : <Bot size={20} />}
              </div>
              
              <div className={`relative p-5 rounded-2xl text-[15px] leading-relaxed shadow-sm border ${
                msg.role === 'user' 
                ? 'bg-slate-900 text-white border-slate-800 rounded-tr-none' 
                : 'bg-white text-slate-700 border-slate-200 rounded-tl-none'
              }`}>
                <div className="prose prose-slate max-w-none prose-sm 
                  prose-headings:font-bold prose-headings:text-slate-900
                  prose-strong:text-indigo-600 prose-strong:font-bold
                  prose-code:text-pink-600 prose-pre:bg-slate-900
                  prose-invert:prose-strong:text-indigo-300">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-center gap-3 text-indigo-500 font-medium pl-1 animate-pulse">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-xs uppercase tracking-widest">Analyzing Data...</span>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Section */}
      <div className="p-6 bg-white border-t border-slate-100">
        <form onSubmit={handleSubmit} className="flex gap-3 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your professional query..."
            className="flex-1 px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-800 transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white px-8 rounded-xl transition-all font-bold text-sm flex items-center gap-2 shadow-lg shadow-indigo-200 active:scale-[0.98]"
          >
            <Send size={18} />
            SEND
          </button>
        </form>
        <p className="text-[10px] text-center text-slate-400 mt-4 uppercase tracking-tighter">Powered by Groq Llama 3.3 Intelligence</p>
      </div>
    </div>
  );
}