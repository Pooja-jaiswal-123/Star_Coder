"use client";
import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Groq from "groq-sdk";
import ReactMarkdown from "react-markdown";

// 1. Setup (Hamesha component ke bahar rakhein)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

export default function BlogGenerator() {
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleGenerateAndSave = async () => {
    if (!topic) return alert("Please enter a topic first!");

    setLoading(true);
    setStatus("Picking a stunning cover image...");

    try {
      // 1. Stable Image Generation (Using LoremFlickr as it's more reliable than source.unsplash)
      const keyword = topic.split(" ")[0] || "technology";
      const dynamicImg = `https://loremflickr.com/1200/600/${keyword}?random=${Math.random()}`;
      setImageUrl(dynamicImg);

      // 2. AI Content Generation
      setStatus("Writing your article with Groq AI...");
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a professional tech blogger. Write in Markdown with clear headings (##), bold text for emphasis, and organized lists.",
          },
          {
            role: "user",
            content: `Write a high-quality blog about: ${topic}. Include an Introduction, 3 detailed sections, and a Summary.`,
          },
        ],
        model: "llama-3.3-70b-versatile",
      });

      const blogData = completion.choices[0]?.message?.content;
      setContent(blogData);

      // 3. Database Save
      setStatus("Publishing to Supabase...");
      const { error } = await supabase.from("blogs").insert([
        {
          title: topic,
          content: blogData,
          image_url: dynamicImg,
          created_at: new Date(),
        },
      ]);

      if (error) {
        console.error("Supabase Insert Error:", error.message);
        // Agar 401 aa raha hai, toh user ko batayein ki keys/RLS check karein
        if(error.code === '42P01') setStatus("Error: 'blogs' table not found!");
        else setStatus("Saving failed (Check RLS Policies)");
      } else {
        setStatus("Success! Blog published.");
      }
    } catch (err) {
      console.error("Process Error:", err);
      setStatus("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#fafafa", minHeight: "100vh", padding: "40px 20px", fontFamily: "system-ui" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        {/* Input Section */}
        <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "20px", color: "#111" }}>AI Content Engine</h1>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              placeholder="Topic: The Future of Agentic AI..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              style={{ flex: 1, padding: "12px 16px", borderRadius: "8px", border: "1px solid #ddd", outline: "none", fontSize: "16px" }}
            />
            <button
              onClick={handleGenerateAndSave}
              disabled={loading}
              style={{ padding: "12px 24px", backgroundColor: loading ? "#ccc" : "#000", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}
            >
              {loading ? "Generating..." : "Publish"}
            </button>
          </div>
          {status && <p style={{ marginTop: "12px", fontSize: "14px", color: "#666" }}>✦ {status}</p>}
        </div>

        {/* Blog Display */}
        {content && (
          <article style={{ background: "white", borderRadius: "20px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
            <img src={imageUrl} alt="Cover" style={{ width: "100%", height: "400px", objectFit: "cover" }} />
            
            <div style={{ padding: "40px" }}>
              <h1 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "20px", lineHeight: "1.1" }}>{topic}</h1>
              <div style={{ display: "flex", gap: "10px", color: "#888", marginBottom: "30px", fontSize: "14px" }}>
                <span>By Rakesh</span> • <span>{new Date().toLocaleDateString()}</span>
              </div>

              <div style={{ lineHeight: "1.8", color: "#333", fontSize: "18px" }}>
                <ReactMarkdown
                  components={{
                    h2: ({node, ...props}) => <h2 style={{marginTop: "40px", marginBottom: "15px", color: "#000"}} {...props} />,
                    p: ({node, ...props}) => <p style={{marginBottom: "20px"}} {...props} />,
                    li: ({node, ...props}) => <li style={{marginBottom: "10px"}} {...props} />,
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            </div>
          </article>
        )}
      </div>
    </div>
  );
}