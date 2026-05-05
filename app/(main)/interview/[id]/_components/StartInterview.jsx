"use client";

import React, { useState, useEffect, useContext, useRef } from "react";
import { InterviewDataContext } from "@/context/interviewDataContext";
import { Button } from "@/components/ui/button";
import {
  Mic,
  MicOff,
  Volume2,
  Loader2,
  UserCircle,
  Download,
  PhoneOff,
  MonitorUp,
} from "lucide-react";
import FeedbackPage from "../feedback/page";

const StartInterview = ({ candidateName = "Candidate" }) => {
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
  const [availableVoices, setAvailableVoices] = useState([]);

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
  const webcamStreamRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const pauseTimerRef = useRef(null);

  // Call Control Refs
  const isCallEndedRef = useRef(false);
  const warningCountRef = useRef(0);

  const questions = interviewInfo?.interviewData?.questionList || [];
  const currentQuestion = questions[currentQuestionIndex];

  // Helper: Stop Media Tracks Safely
  const stopMediaTracks = (stream) => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
        track.enabled = false;
      });
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const loadVoices = () => {
        setAvailableVoices(window.speechSynthesis.getVoices());
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  useEffect(() => {
    currentQuestionIndexRef.current = currentQuestionIndex;
  }, [currentQuestionIndex]);

  // ==========================================
  // CORE FUNCTIONS FOR INTERVIEW & CALL ENDING
  // ==========================================

  const finishInterview = async (finalAnswers) => {
    // Stop all media
    handleMediaCleanup();

    setStatus("Generating feedback...");
    setGeneratingFeedback(true);
    await generateFeedback(finalAnswers);
    setGeneratingFeedback(false);
    setInterviewDone(true);
  };

  // Dedicated cleanup function for camera and screen
  const handleMediaCleanup = () => {
    setIsWebcamOn(false);
    setIsRecordingScreen(false);

    // Stop Webcam
    if (webcamStreamRef.current) {
      stopMediaTracks(webcamStreamRef.current);
      webcamStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // Stop Screen Recording
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      try {
        mediaRecorderRef.current.stop();
        // Also stop the tracks of the screen stream
        if (mediaRecorderRef.current.stream) {
          stopMediaTracks(mediaRecorderRef.current.stream);
        }
      } catch (error) {
        console.warn("MediaRecorder stop error:", error);
      }
    }
  };

  const handleEndCall = () => {
    isCallEndedRef.current = true;

    try {
      window.speechSynthesis.cancel();
    } catch (error) {
      console.warn("Speech synthesis cancel error:", error);
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (error) {
        console.warn("Speech recognition abort error:", error);
      }
    }

    clearTimeout(silenceTimerRef.current);
    clearTimeout(pauseTimerRef.current);

    setIsListening(false);
    setIsSpeaking(false);

    // Immediately stop camera and screen
    handleMediaCleanup();

    if (!interviewDone && !generatingFeedback) {
      finishInterview(answers);
    }
  };

  const handleMediaDisconnection = (mediaType) => {
    if (isCallEndedRef.current) return;

    warningCountRef.current += 1;
    if (warningCountRef.current >= 3) {
      setTimeout(() => {
        alert(
          `You have stopped ${mediaType} 3 times. The interview will now automatically end.`,
        );
        handleEndCall();
      }, 100);
    } else {
      setTimeout(() => {
        alert(
          `Warning ${warningCountRef.current}/3: Please do not stop your ${mediaType}. It is mandatory.`,
        );
      }, 100);

      if (mediaType === "Screen Share") {
        setIsRecordingScreen(false);
        setInterviewStarted(false);
      } else {
        setIsWebcamOn(false);
      }
    }
  };

  // ==========================================
  // MEDIA SETUP
  // ==========================================

  useEffect(() => {
    const enableWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        webcamStreamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;

        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) {
          videoTrack.onended = () => handleMediaDisconnection("Camera");
        }
      } catch (err) {
        console.error("Camera error:", err);
        setIsWebcamOn(false);
      }
    };
    if (isWebcamOn && !isCallEndedRef.current) {
      enableWebcam();
    }

    return () => {
      if (webcamStreamRef.current) stopMediaTracks(webcamStreamRef.current);
    };
  }, [isWebcamOn]);

  const handleStartInterviewAndRecord = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: "monitor" },
        audio: true,
      });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const localChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) localChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(localChunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setRecordingUrl(url);
        stopMediaTracks(stream);
        setIsRecordingScreen(false);
      };

      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.onended = () => {
          if (mediaRecorderRef.current?.state !== "inactive") {
            mediaRecorderRef.current.stop();
          }
          handleMediaDisconnection("Screen Share");
        };
      }

      mediaRecorder.start();
      setIsRecordingScreen(true);
      setInterviewStarted(true);

      if (introPlayed && !isCallEndedRef.current) {
        askQuestion(currentQuestionIndexRef.current);
      }
    } catch (err) {
      console.error("Screen recording failed:", err);
      alert("Interview requires entire screen recording.");
    }
  };

  // ==========================================
  // SPEECH LOGIC
  // ==========================================

  const speakText = (text, onEndCallback) => {
    if (isCallEndedRef.current || !text) return;

    window.speechSynthesis.cancel();
    clearTimeout(silenceTimerRef.current);
    clearTimeout(pauseTimerRef.current);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.1;

    let voice = availableVoices.find(
      (v) =>
        (v.lang === "en-IN" || v.lang === "hi-IN") &&
        !v.name.toLowerCase().includes("ravi"),
    );
    if (!voice)
      voice = availableVoices.find(
        (v) =>
          v.lang.startsWith("en") && v.name.toLowerCase().includes("female"),
      );
    if (voice) utterance.voice = voice;

    utterance.onstart = () => {
      if (isCallEndedRef.current) return window.speechSynthesis.cancel();
      setIsSpeaking(true);
      setStatus("AI is speaking...");
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      if (!isCallEndedRef.current && onEndCallback) onEndCallback();
    };

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (
      interviewStarted &&
      !introPlayed &&
      candidateName &&
      !isCallEndedRef.current
    ) {
      const timer = setTimeout(() => {
        speakText(`Hello ${candidateName}. Welcome. Let's begin.`, () => {
          setIntroPlayed(true);
          askQuestion(currentQuestionIndexRef.current);
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [interviewStarted]);

  useEffect(() => {
    if (interviewStarted && introPlayed && !isCallEndedRef.current) {
      askQuestion(currentQuestionIndex);
    }
  }, [currentQuestionIndex]);

  const askQuestion = (index) => {
    const qText = questions[index]?.question;
    if (!qText || isCallEndedRef.current) return;
    setTranscript("");
    transcriptRef.current = "";
    speakText(qText, autoStartMic);
  };

  const autoStartMic = () => {
    if (isCallEndedRef.current) return;
    startListening();
    silenceTimerRef.current = setTimeout(() => {
      if (!transcriptRef.current.trim() && !isCallEndedRef.current) {
        stopListening(false);
        handleNoResponse();
      }
    }, 10000);
  };

  const handleNoResponse = () => {
    if (questionAttemptRef.current === 1) {
      questionAttemptRef.current = 2;
      speakText(
        "I didn't hear you. Let me repeat. " +
          (questions[currentQuestionIndexRef.current]?.question || ""),
        autoStartMic,
      );
    } else {
      handleAutoSubmitAnswer(true);
    }
  };

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition || isCallEndedRef.current) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsListening(true);
      setStatus("Listening...");
    };

    recognition.onresult = (event) => {
      if (isCallEndedRef.current) return;

      let currentChunk = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          currentChunk += event.results[i][0].transcript;
        }
      }

      if (currentChunk) {
        const fullTranscript = (transcriptRef.current + " " + currentChunk)
          .toLowerCase()
          .trim();
        setTranscript((prev) => prev + " " + currentChunk);

        // --- INSTANT REPEAT CHECK ---
        const repeatKeywords = [
          "repeat",
          "pardon",
          "again",
          "fir se",
          "phir se",
        ];
        if (repeatKeywords.some((kw) => fullTranscript.includes(kw))) {
          recognition.stop();
          clearTimeout(silenceTimerRef.current);
          clearTimeout(pauseTimerRef.current);

          // AI तुरंत जवाब देगा बिना 3-4 सेकंड रुके
          setTranscript("");
          transcriptRef.current = "";
          speakText(
            "Sure, I will repeat. " +
              questions[currentQuestionIndexRef.current]?.question,
            autoStartMic,
          );
          return;
        }

        // Normal response timer
        clearTimeout(pauseTimerRef.current);
        pauseTimerRef.current = setTimeout(() => {
          stopListening(false);
          handleAutoSubmitAnswer(false);
        }, 2000);
      }
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
    setStatus("Thinking...");
    if (shouldSubmit && !isCallEndedRef.current) handleAutoSubmitAnswer(false);
  };

  const handleAutoSubmitAnswer = async (forceSubmit = false) => {
    if (isCallEndedRef.current) return;
    const currentAns = transcriptRef.current.trim();
    const currentQ = questions[currentQuestionIndexRef.current]?.question;

    if (!forceSubmit) {
      const wordCount = currentAns
        .split(" ")
        .filter((w) => w.length > 0).length;
      if (wordCount > 0 && wordCount < 4) {
        setTranscript("");
        speakText("Could you please elaborate a bit more?", autoStartMic);
        return;
      }
    }

    const newAnswer = {
      question: currentQ,
      answer: currentAns || "(No answer)",
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

  const generateFeedback = async () => {
    const staticFeedbackData = {
      overallScore: 8,
      strengths: ["Clear communication", "Technical knowledge"],
      weaknesses: ["Needs more examples"],
      hiringRecommendation: "Recommended",
      summary: "Good potential.",
    };
    await new Promise((r) => setTimeout(r, 2000));
    setFeedback(staticFeedbackData);
  };

  // Rendering logic remains same as your original code...
  if (generatingFeedback) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-10 rounded-3xl border border-gray-200 shadow-xl">
          <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Analyzing Interview...
          </h2>
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
              download="Interview.webm"
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg text-sm"
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
            <h2 className="text-2xl font-bold text-gray-800 mb-8">
              Share Entire Screen
            </h2>
            <Button
              onClick={handleStartInterviewAndRecord}
              className="w-full h-14 bg-blue-600 text-white text-lg rounded-xl"
            >
              Start Screen Share
            </Button>
          </div>
        </div>
      )}

      <header className="h-16 px-6 border-b border-gray-200 flex items-center justify-between bg-white z-10">
        <span className="text-gray-800 font-semibold">
          Virtual Interview Room
        </span>
        <div className="bg-blue-50 text-blue-700 font-semibold px-4 py-1.5 rounded-full text-sm">
          Q {currentQuestionIndex + 1} / {questions.length}
        </div>
      </header>

      <main
        className={`flex-1 p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto w-full ${!interviewStarted ? "blur-sm" : ""}`}
      >
        <div className="relative bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-32 h-32 rounded-full mb-8 shadow-lg border-4 border-white bg-white overflow-hidden">
              <img
                src="/a1.png"
                alt="AI"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-2xl text-gray-800 font-medium leading-relaxed max-w-lg">
              {introPlayed ? `"${currentQuestion?.question}"` : "Starting..."}
            </h3>
          </div>
        </div>

        <div className="relative bg-black rounded-3xl overflow-hidden flex items-center justify-center">
          {isWebcamOn ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover mirror"
              style={{ transform: "scaleX(-1)" }}
            />
          ) : (
            <div className="text-gray-400 flex flex-col items-center">
              <UserCircle className="w-24 h-24 mb-4 opacity-50" />
              <p>Camera is OFF</p>
            </div>
          )}
          <div className="absolute bottom-8 text-xs text-white bg-black/50 px-4 py-1.5 rounded-full">
            {status}
          </div>
        </div>
      </main>

      <footer className="h-24 bg-white border-t border-gray-200 flex items-center justify-center gap-6">
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center ${isListening ? "bg-red-500 text-white animate-pulse" : "bg-gray-100 text-gray-400"}`}
        >
          {isListening ? (
            <Mic className="w-6 h-6" />
          ) : (
            <MicOff className="w-6 h-6" />
          )}
        </div>
        {interviewStarted && (
          <button
            onClick={handleEndCall}
            className="w-14 h-14 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:scale-110 transition-all"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        )}
      </footer>
    </div>
  );
};

export default StartInterview;
