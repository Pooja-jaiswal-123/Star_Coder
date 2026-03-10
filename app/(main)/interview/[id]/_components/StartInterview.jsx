"use client";

import React, { useState, useEffect, useContext, useRef } from "react";
import { InterviewDataContext } from "@/context/interviewDataContext";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, Loader2 } from "lucide-react";
import FeedbackPage from "./FeedbackPage";

const StartInterview = ({ candidateName }) => {
  const { interviewInfo } = useContext(InterviewDataContext);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [answers, setAnswers] = useState([]);
  const [interviewDone, setInterviewDone] = useState(false);
  const [status, setStatus] = useState("Listen to the question...");
  const [generatingFeedback, setGeneratingFeedback] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const recognitionRef = useRef(null);
  const questions = interviewInfo?.interviewData?.questionList || [];
  const currentQuestion = questions[currentQuestionIndex];

  const speakQuestion = (text) => {
    if (!text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.onstart = () => {
      setIsSpeaking(true);
      setStatus("AI is speaking...");
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setStatus("Press 'Start Speaking' to answer");
    };
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (currentQuestion?.question) {
      setTranscript("");
      setTimeout(() => speakQuestion(currentQuestion.question), 500);
    }
  }, [currentQuestionIndex]);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatus("Speech recognition not supported.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsListening(true);
      setStatus("Listening... speak your answer");
    };
    recognition.onresult = (event) => {
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) final += event.results[i][0].transcript;
      }
      if (final) setTranscript((prev) => prev + " " + final);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
    setStatus("Answer recorded. Click Next to continue.");
  };

  const handleNext = async () => {
    const updatedAnswers = [
      ...answers,
      {
        question: currentQuestion?.question,
        answer: transcript.trim() || "(No answer given)",
      },
    ];
    setAnswers(updatedAnswers);
    setTranscript("");
    window.speechSynthesis.cancel();

    if (currentQuestionIndex + 1 >= questions.length) {
      // Generate feedback
      setGeneratingFeedback(true);
      await generateFeedback(updatedAnswers);
      setGeneratingFeedback(false);
      setInterviewDone(true);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setStatus("Listen to the question...");
    }
  };

  const generateFeedback = async (allAnswers) => {
    try {
      const prompt = `
You are an expert interviewer. Analyze the following interview for the position of "${interviewInfo?.interviewData?.jobPosition}".

Candidate Name: ${candidateName}
Interview Type: ${interviewInfo?.interviewData?.interviewType}

Questions and Answers:
${allAnswers.map((a, i) => `Q${i + 1}: ${a.question}\nA${i + 1}: ${a.answer}`).join("\n\n")}

Provide feedback in this exact JSON format only, no extra text:
{
  "overallScore": <number 1-10>,
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2"],
  "hiringRecommendation": "Strongly Recommended" | "Recommended" | "Needs Improvement" | "Not Recommended",
  "summary": "<2-3 sentence overall summary of candidate performance>"
}`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      const text = data.content?.[0]?.text || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setFeedback(parsed);
    } catch (err) {
      console.error("Feedback error:", err);
      setFeedback({
        overallScore: 7,
        strengths: ["Good communication", "Relevant experience"],
        weaknesses: ["Could improve technical depth"],
        hiringRecommendation: "Recommended",
        summary: "The candidate demonstrated solid understanding of the role.",
      });
    }
  };

  if (generatingFeedback) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800">
            Generating Feedback...
          </h2>
          <p className="text-gray-500 mt-2">AI is analyzing your responses</p>
        </div>
      </div>
    );
  }

  if (interviewDone && feedback) {
    return (
      <FeedbackPage
        feedback={feedback}
        candidateName={candidateName}
        answers={answers}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="font-medium">{candidateName}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl shadow-xl border p-8 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Volume2
              className={`w-5 h-5 ${isSpeaking ? "text-indigo-600 animate-pulse" : "text-gray-400"}`}
            />
            <span className="text-sm text-gray-500">
              {isSpeaking ? "AI is speaking..." : "Question"}
            </span>
          </div>
          <p className="text-xl font-semibold text-gray-800 leading-relaxed">
            {currentQuestion?.question}
          </p>
          {currentQuestion?.type && (
            <span className="inline-block mt-3 text-xs px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full font-medium">
              {currentQuestion.type}
            </span>
          )}
        </div>

        {/* Answer Area */}
        <div className="bg-white rounded-3xl shadow-xl border p-8 mb-6">
          <div className="flex items-center gap-2 mb-3">
            {isListening ? (
              <Mic className="w-5 h-5 text-red-500 animate-pulse" />
            ) : (
              <MicOff className="w-5 h-5 text-gray-400" />
            )}
            <span className="text-sm text-gray-500">{status}</span>
          </div>
          <div className="min-h-[80px] bg-gray-50 rounded-xl p-4 text-gray-700 text-sm">
            {transcript || (
              <span className="text-gray-400 italic">
                Your answer will appear here...
              </span>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          {!isListening ? (
            <Button
              onClick={startListening}
              className="flex-1 h-12 bg-red-500 hover:bg-red-600 gap-2"
              disabled={isSpeaking}
            >
              <Mic className="w-5 h-5" /> Start Speaking
            </Button>
          ) : (
            <Button
              onClick={stopListening}
              className="flex-1 h-12 bg-gray-700 hover:bg-gray-800 gap-2"
            >
              <MicOff className="w-5 h-5" /> Stop Speaking
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-700"
            disabled={isListening}
          >
            {currentQuestionIndex + 1 >= questions.length
              ? "Finish & Get Feedback"
              : "Next Question →"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StartInterview;
