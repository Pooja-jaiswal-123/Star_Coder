"use client";
import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Groq from "groq-sdk";
import ReactMarkdown from "react-markdown";
import { Sparkles, PenTool, Send, Loader2, CheckCircle } from "lucide-react";

// Setup
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

export default function BlogGenerator() {
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleGenerateAndSave = async () => {
    if (!topic) return alert("Please enter a topic first!");

    setLoading(true);
    setStatus("AI is researching and finding relevant visuals...");

    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a professional tech blogger. 
            Write in high-quality Markdown. 
            IMPORTANT: You must intersperse the text with relevant images. 
            Every 2 paragraphs, insert an image using this exact format: ![Relevant Description](https://loremflickr.com/800/450/tag) 
            Replace 'tag' with a very specific keyword related to that paragraph.
            Include a Title, Introduction, 3 detailed sections, and a Conclusion.`,
          },
          {
            role: "user",
            content: `Write a comprehensive blog post about: ${topic}`,
          },
        ],
        model: "llama-3.3-70b-versatile",
      });

      const blogData = completion.choices[0]?.message?.content;
      setContent(blogData);

      setStatus("Publishing to your dashboard...");
      const { error } = await supabase.from("blogs").insert([
        {
          title: topic,
          content: blogData,
          created_at: new Date(),
        },
      ]);

      if (error) {
        setStatus("Published locally, but database sync failed.");
      } else {
        setStatus("Success! Blog is live with relevant visuals.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10 px-4 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-[2rem] shadow-sm mb-10 transition-all">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
              <PenTool size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">
                AI Content Engine
              </h1>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                Generate Premium Articles
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Ex: The Impact of Agentic AI in 2026..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full pl-4 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-medium"
              />
            </div>
            <button
              onClick={handleGenerateAndSave}
              disabled={loading}
              className={`px-8 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 ${
                loading
                  ? "bg-slate-100 text-slate-400"
                  : "bg-blue-600 text-white shadow-lg shadow-blue-100 hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
              {loading ? "Writing..." : "Publish Blog"}
            </button>
          </div>

          {status && (
            <div className="mt-4 flex items-center gap-2 text-[11px] font-bold text-blue-600 animate-pulse">
              <Sparkles size={12} /> {status}
            </div>
          )}
        </div>

        {/* Generated Content Display */}
        {content && (
          <article className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-3 mb-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <span>By AI Assistant</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>

              <div className="prose prose-slate max-w-none prose-img:rounded-3xl prose-img:shadow-lg prose-h2:text-2xl prose-h2:font-bold prose-h2:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed">
                <ReactMarkdown
                  components={{
                    // FIX: Prevent <p> nesting issues by checking children
                    p: ({ node, children, ...props }) => {
                      // Check if this paragraph contains an image
                      const hasImage = node.children.some(
                        (child) => child.tagName === "img",
                      );

                      // If it has an image, render as div to keep HTML valid
                      if (hasImage) {
                        return <div className="my-10 w-full">{children}</div>;
                      }
                      return (
                        <p
                          className="mb-6 text-[16px] md:text-[18px]"
                          {...props}
                        >
                          {children}
                        </p>
                      );
                    },

                    img: ({ node, ...props }) => (
                      <div className="flex flex-col items-center">
                        <img
                          {...props}
                          className="w-full h-auto max-h-[450px] object-cover rounded-[2rem] border-4 border-white shadow-xl"
                          alt={props.alt || "Relevant Illustration"}
                        />
                        <span className="block text-center text-[10px] text-slate-400 mt-3 italic font-medium uppercase tracking-widest">
                          {props.alt || "Relevant Illustration"}
                        </span>
                      </div>
                    ),

                    h2: ({ node, ...props }) => (
                      <h2
                        className="text-2xl font-bold mt-12 mb-4 text-slate-900"
                        {...props}
                      />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="mb-2 ml-4 list-disc" {...props} />
                    ),
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>

              <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-green-600 font-bold text-[10px] uppercase tracking-widest">
                  <CheckCircle size={14} /> Published Successfully
                </div>
                <button className="text-blue-600 font-bold text-xs hover:underline">
                  Share Article
                </button>
              </div>
            </div>
          </article>
        )}
      </div>
    </div>
  );
}
