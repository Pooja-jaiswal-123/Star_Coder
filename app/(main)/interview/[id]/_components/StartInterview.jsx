"use client";

import React, { useState, useEffect, useContext, useRef } from "react";
import { InterviewDataContext } from "@/context/interviewDataContext";
import { Button } from "@/components/ui/button";
import {
  Mic,
  MicOff,
  Volume2,
  Loader2,
  Video,
  VideoOff,
  MonitorUp,
  UserCircle,
  Download,
} from "lucide-react";
import FeedbackPage from "../feedback/page";

const StartInterview = ({ candidateName }) => {
  const { interviewInfo } = useContext(InterviewDataContext);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // States
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [answers, setAnswers] = useState([]);
  const [interviewDone, setInterviewDone] = useState(false);
  const [status, setStatus] = useState("Waiting to start...");
  const [generatingFeedback, setGeneratingFeedback] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Control States
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [introPlayed, setIntroPlayed] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState(null);

  const [isWebcamOn, setIsWebcamOn] = useState(true);
  const [isRecordingScreen, setIsRecordingScreen] = useState(false);

  // Refs
  const videoRef = useRef(null);
  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const transcriptRef = useRef("");
  const currentQuestionIndexRef = useRef(0);
  const questionAttemptRef = useRef(1);

  const silenceTimerRef = useRef(null); // Agar 10 sec tak kuch nahi bola
  const pauseTimerRef = useRef(null); // Bolte bolte 5 sec ka pause liya

  const questions = interviewInfo?.interviewData?.questionList || [];
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);
  useEffect(() => {
    currentQuestionIndexRef.current = currentQuestionIndex;
  }, [currentQuestionIndex]);

  // Webcam Setup
  useEffect(() => {
    let stream;
    const enableWebcam = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Camera error:", err);
        setIsWebcamOn(false);
      }
    };
    if (isWebcamOn) enableWebcam();
    return () => {
      if (stream) stream.getTracks().forEach((track) => track.stop());
    };
  }, [isWebcamOn]);

  // Screen Share Setup - Force Current Tab preference
  const handleStartInterviewAndRecord = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: "browser",
        },
        audio: true,
        preferCurrentTab: true,
      });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      let localChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) localChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(localChunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setRecordingUrl(url);
        stream.getTracks().forEach((track) => track.stop());
        setIsRecordingScreen(false);
      };

      stream.getVideoTracks()[0].onended = () => {
        mediaRecorder.stop();
      };

      mediaRecorder.start();
      setIsRecordingScreen(true);
      setInterviewStarted(true);
    } catch (err) {
      console.error("Screen recording failed:", err);
      alert(
        "Interview requires screen recording. Please share your Current Tab to begin.",
      );
    }
  };

  // AI Speech Setup
  const speakText = (text, onEndCallback) => {
    if (!text) return;
    window.speechSynthesis.cancel();
    clearTimeout(silenceTimerRef.current);
    clearTimeout(pauseTimerRef.current);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setStatus("AI is speaking...");
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      if (onEndCallback) onEndCallback();
    };

    window.speechSynthesis.speak(utterance);
  };

  // Intro Flow
  useEffect(() => {
    if (interviewStarted && !introPlayed && candidateName) {
      setTimeout(() => {
        speakText(
          `Hello ${candidateName}. Welcome to your interview for the ${interviewInfo?.interviewData?.jobPosition || "job"} role. Let's begin.`,
          () => {
            setIntroPlayed(true);
            askQuestion(currentQuestionIndexRef.current);
          },
        );
      }, 1000);
    }
  }, [interviewStarted]);

  useEffect(() => {
    if (interviewStarted && introPlayed) {
      askQuestion(currentQuestionIndex);
    }
  }, [currentQuestionIndex]);

  const askQuestion = (index) => {
    const qText = questions[index]?.question;
    if (!qText) return;

    setTranscript("");
    transcriptRef.current = "";
    questionAttemptRef.current = 1;

    speakText(qText, () => {
      autoStartMic();
    });
  };

  const autoStartMic = () => {
    startListening();
    // 10 Seconds timer if user is completely silent initially
    silenceTimerRef.current = setTimeout(() => {
      if (!transcriptRef.current.trim()) {
        stopListening(false);
        handleNoResponse();
      }
    }, 10000);
  };

  const handleNoResponse = () => {
    if (questionAttemptRef.current === 1) {
      questionAttemptRef.current = 2;
      speakText(
        "I didn't hear you clearly. Let me repeat the question. " +
          questions[currentQuestionIndexRef.current].question,
        autoStartMic,
      );
    } else {
      handleAutoSubmitAnswer(true); // Force skip after 2 fails
    }
  };

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatus("Voice features are not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsListening(true);
      setStatus("Listening..."); // Changed to natural text
    };

    recognition.onresult = (event) => {
      clearTimeout(silenceTimerRef.current);
      clearTimeout(pauseTimerRef.current);

      let currentTranscriptChunk = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          currentTranscriptChunk += event.results[i][0].transcript;
        }
      }

      if (currentTranscriptChunk) {
        setTranscript((prev) => prev + " " + currentTranscriptChunk);
      }

      // NAYA TIMER: User chup hua toh exactly 5 seconds wait karega.
      pauseTimerRef.current = setTimeout(() => {
        if (transcriptRef.current.trim()) {
          stopListening(false);
          handleAutoSubmitAnswer(false);
        }
      }, 5000);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const stopListening = (shouldSubmit) => {
    if (recognitionRef.current) recognitionRef.current.stop();
    clearTimeout(silenceTimerRef.current);
    clearTimeout(pauseTimerRef.current);
    setIsListening(false);
    setStatus("Thinking..."); // Clean, natural status

    if (shouldSubmit) {
      handleAutoSubmitAnswer(false);
    }
  };

  // --- SMART EVALUATION LOGIC (Hinglish Supported) ---
  const handleAutoSubmitAnswer = async (forceSubmit = false) => {
    clearTimeout(silenceTimerRef.current);
    clearTimeout(pauseTimerRef.current);
    window.speechSynthesis.cancel();

    const currentAns = transcriptRef.current.trim();
    const lowerAns = currentAns.toLowerCase();
    const currentQ = questions[currentQuestionIndexRef.current]?.question;

    if (!forceSubmit) {
      const repeatKeywords = [
        "repeat",
        "pardon",
        "what was",
        "say that again",
        "fir se",
        "sunai nahi",
        "phir se",
      ];
      const skipKeywords = [
        "skip",
        "don't know",
        "pass",
        "next",
        "no idea",
        "nahi pata",
        "move on",
        "mujhe nahi aa raha",
        "mujhe nahi aata",
        "mujhe nahi pata",
        "aage badho",
      ];

      if (repeatKeywords.some((kw) => lowerAns.includes(kw))) {
        setTranscript("");
        speakText(
          "Sure, I will repeat the question. " + currentQ,
          autoStartMic,
        );
        return;
      }

      if (skipKeywords.some((kw) => lowerAns.includes(kw))) {
        // Automatically skips to next block below
      } else {
        const wordCount = currentAns
          .split(" ")
          .filter((w) => w.length > 0).length;
        if (wordCount > 0 && wordCount < 5) {
          setTranscript("");
          speakText(
            "That was quite brief. Could you please elaborate a bit more?",
            autoStartMic,
          );
          return;
        }
      }
    }

    // Save Answer and Move to Next
    const newAnswer = {
      question: currentQ,
      answer: currentAns || "(Skipped/No answer)",
    };

    setAnswers((prev) => {
      const updated = [...prev, newAnswer];
      if (currentQuestionIndexRef.current + 1 >= questions.length) {
        finishInterview(updated);
      } else {
        setCurrentQuestionIndex((prevIdx) => prevIdx + 1);
      }
      return updated;
    });
  };

  const finishInterview = async (finalAnswers) => {
    if (isRecordingScreen && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setStatus("Generating feedback...");
    setGeneratingFeedback(true);
    await generateFeedback(finalAnswers);
    setGeneratingFeedback(false);
    setInterviewDone(true);
  };

  const generateFeedback = async (allAnswers) => {
    try {
      const prompt = `You are an expert interviewer. Analyze the following interview for the position of "${interviewInfo?.interviewData?.jobPosition}".
      Candidate Name: ${candidateName}
      Questions and Answers:
      ${allAnswers.map((a, i) => `Q${i + 1}: ${a.question}\nA${i + 1}: ${a.answer}`).join("\n\n")}
      Provide feedback in this exact JSON format only:
      {
        "overallScore": <number 1-10>,
        "strengths": ["strength1", "strength2"],
        "weaknesses": ["weakness1", "weakness2"],
        "hiringRecommendation": "Recommended",
        "summary": "Summary text"
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
      setFeedback({
        overallScore: 7,
        strengths: ["Good effort"],
        weaknesses: ["Needs improvement"],
        hiringRecommendation: "Recommended",
        summary: "Default fallback feedback.",
      });
    }
  };

  if (generatingFeedback) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-10 rounded-3xl border border-gray-200 shadow-xl">
          <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Analyzing Interview...
          </h2>
          <p className="text-gray-500">
            AI is generating your comprehensive feedback report
          </p>
        </div>
      </div>
    );
  }

  if (interviewDone && feedback) {
    return (
      <div className="relative">
        {recordingUrl && (
          <div className="absolute top-4 right-4 z-50">
            <a
              href={recordingUrl}
              download={`${candidateName.replace(" ", "_")}_Interview.webm`}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg font-medium text-sm transition-all"
            >
              <Download className="w-4 h-4" /> Download Recording
            </a>
          </div>
        )}
        <FeedbackPage
          feedback={feedback}
          candidateName={candidateName}
          answers={answers}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans relative">
      {!interviewStarted && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-10 rounded-3xl max-w-md w-full text-center shadow-2xl">
            <MonitorUp className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Share Screen to Start
            </h2>
            <p className="text-gray-500 mb-2 text-sm">
              Interview requires screen recording.
            </p>
            <p className="text-blue-600 mb-8 font-medium text-sm">
              Tip: Select "This Tab" or "Current Tab" to begin.
            </p>
            <Button
              onClick={handleStartInterviewAndRecord}
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white text-lg rounded-xl shadow-lg"
            >
              Start Screen Share
            </Button>
          </div>
        </div>
      )}

      <header className="h-16 px-6 border-b border-gray-200 flex items-center justify-between bg-white shadow-sm z-10">
        <div className="flex items-center gap-4">
          <span className="text-gray-800 font-semibold text-lg">
            Virtual Interview Room
          </span>
          <div className="h-5 w-[1px] bg-gray-300"></div>
          <span className="text-gray-500 font-medium text-sm">
            Role: {interviewInfo?.interviewData?.jobPosition || "Candidate"}
          </span>
        </div>
        <div className="flex items-center gap-4">
          {isRecordingScreen && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-full text-xs font-semibold border border-red-100 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
              Recording Screen
            </div>
          )}
          <div className="bg-blue-50 text-blue-700 font-semibold px-4 py-1.5 rounded-full text-sm border border-blue-100 shadow-sm">
            Q {currentQuestionIndex + 1} / {questions.length}
          </div>
        </div>
      </header>

      <main
        className={`flex-1 p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto w-full transition-all duration-500 ${!interviewStarted ? "blur-sm opacity-50" : ""}`}
      >
        <div className="relative bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm flex flex-col">
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium text-gray-700 shadow-sm border border-gray-100 z-10 flex items-center gap-2">
            <Volume2
              className={`w-4 h-4 ${isSpeaking ? "text-blue-600 animate-pulse" : "text-gray-400"}`}
            />
            AI Interviewer
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-gray-50 to-white">
            <div className="relative mb-8">
              <div
                className={`absolute inset-0 bg-blue-400 rounded-full blur-2xl opacity-20 ${isSpeaking ? "animate-pulse scale-150" : "scale-100"} transition-all duration-700`}
              ></div>
              <div className="w-32 h-32 rounded-full flex items-center justify-center relative z-10 shadow-lg border-4 border-white bg-white overflow-hidden">
                <img
                  src="/ai.png"
                  alt="AI Interviewer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <h3 className="text-2xl text-gray-800 font-medium leading-relaxed max-w-lg transition-all">
              {introPlayed
                ? `"${currentQuestion?.question}"`
                : "Waiting for screen share..."}
            </h3>
          </div>

          <div className="h-1.5 bg-gray-100 w-full">
            <div
              className="h-full bg-blue-600 transition-all duration-500"
              style={{
                width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="relative bg-black rounded-3xl overflow-hidden border border-gray-200 shadow-sm flex items-center justify-center">
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium text-white shadow-sm z-10 flex items-center gap-2">
            {candidateName} (You)
          </div>

          {isWebcamOn ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
              style={{ transform: "scaleX(-1)" }}
            />
          ) : (
            <div className="text-gray-400 flex flex-col items-center">
              <UserCircle className="w-24 h-24 mb-4 opacity-50" />
              <p className="font-medium">Camera is turned off</p>
            </div>
          )}

          <div className="absolute bottom-8 left-0 right-0 px-8 flex flex-col items-center pointer-events-none">
            <div className="text-xs font-medium text-white mb-2 bg-black/50 px-4 py-1.5 rounded-full backdrop-blur-md transition-all">
              {status}
            </div>
          </div>
        </div>
      </main>

      <footer className="h-24 bg-white border-t border-gray-200 flex items-center justify-center gap-6 px-6 relative shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
            isListening
              ? "bg-red-500 text-white shadow-red-200 shadow-lg scale-105 animate-pulse"
              : "bg-gray-100 text-gray-400 border border-gray-200"
          }`}
          title="Mic Status (Auto-managed)"
        >
          {isListening ? (
            <Mic className="w-6 h-6" />
          ) : (
            <MicOff className="w-6 h-6" />
          )}
        </div>
      </footer>
    </div>
  );
};

export default StartInterview;
