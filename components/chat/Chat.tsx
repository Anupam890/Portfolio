"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Loader2, X } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatProps {
  profile: any;
}

const SYSTEM_PROMPT = `You are an AI assistant that represents Anupam Mandal.

Your role:
- Act as a professional, friendly AI version of Anupam Mandal
- Help visitors understand Anupam's skills, experience, projects, and interests
- Communicate clearly, confidently, and concisely

Background information:
- Name: Anupam Mandal
- Role: Full-Stack Developer & Data Engineer
- Experience level: Early-career engineer with strong hands-on project experience
- Core skills:
  - Frontend: Next.js, React, TypeScript, Tailwind CSS
  - Backend: Node.js, Express, REST APIs
  - Databases: PostgreSQL, Snowflake
  - Data Engineering: ETL pipelines, Airflow, data modeling
  - DevOps & Tools: Git, Docker, CI/CD, Vercel
- Interests:
  - Building scalable web systems
  - Data platforms and automation
  - Applying AI to real-world products
- Location preference: Bangalore or Remote roles

Behavior rules:
- Answer ONLY questions related to Anupam Mandal, his work, skills, projects, or career
- If a question is unrelated, politely redirect the conversation back to Anupam
- Do NOT invent experience, companies, or achievements
- If you are unsure, say so honestly

Tone & style:
- Friendly, professional, and conversational
- Avoid excessive emojis or slang
- Keep responses concise but informative
- Use bullet points when helpful

Restrictions:
- Do not answer political, medical, legal, or personal questions
- Do not provide unrelated general knowledge
- Do not role-play as anyone other than Anupam Mandal

Goal:
Help recruiters, developers, and visitors quickly understand who Anupam Mandal is and why he would be a strong hire.`;

const STARTER_QUESTIONS = [
  "What technologies does Anupam work with?",
  "Tell me about Anupam's experience",
  "What projects has Anupam built?",
  "What are Anupam's strengths?",
];

export default function Chat({ profile }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `Hi! 👋 I'm an AI assistant representing Anupam Mandal. I can answer questions about his skills, experience, projects, and career. What would you like to know?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent, question?: string) => {
    e.preventDefault();
    const messageText = question || input.trim();

    if (!messageText || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Call API route to get AI response
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          systemPrompt: SYSTEM_PROMPT,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      // Add assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);

      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleStarterQuestion = (question: string) => {
    handleSubmit({ preventDefault: () => {} } as React.FormEvent, question);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: `Hi! 👋 I'm an AI assistant representing Anupam Mandal. I can answer questions about his skills, experience, projects, and career. What would you like to know?`,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-zinc-950 dark:via-blue-950/20 dark:to-purple-950/20" />
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 dark:bg-blue-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      {/* Header */}
      <div className="relative z-10 backdrop-blur-2xl bg-white/60 dark:bg-zinc-900/60 border-b border-white/20 dark:border-zinc-800/50 shadow-lg shadow-black/5">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse" />
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-xl">
                  <Bot className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-900 shadow-lg" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 dark:from-white dark:via-zinc-100 dark:to-white bg-clip-text text-transparent">
                  Anupam AI
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                  Powered by Gemini 2.5
                </p>
              </div>
            </div>
            <button
              onClick={handleClearChat}
              className="px-3 py-2 rounded-lg bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-700/50 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all duration-200 text-sm font-medium shadow-sm hover:shadow flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="relative z-10 flex-1 overflow-y-auto px-6 py-8 space-y-6 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex gap-4 animate-fade-in ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.role === "assistant" && (
              <div className="relative group flex-shrink-0">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-60 group-hover:opacity-100 transition duration-300" />
                <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                  <Bot className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
              </div>
            )}

            <div
              className={`group max-w-[85%] md:max-w-[75%] ${
                message.role === "user"
                  ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-xl shadow-blue-600/30 dark:shadow-blue-500/20"
                  : "bg-white/90 dark:bg-zinc-900/90 text-zinc-900 dark:text-white border border-zinc-200/50 dark:border-zinc-700/50 shadow-xl shadow-black/5 dark:shadow-black/20 backdrop-blur-xl"
              } rounded-2xl px-5 py-4 transition-all duration-300 hover:scale-[1.01]`}
            >
              <div className="text-[15px] leading-relaxed prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => (
                      <p className="mb-2 last:mb-0">{children}</p>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-bold">{children}</strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic">{children}</em>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc ml-4 mb-2">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal ml-4 mb-2">{children}</ol>
                    ),
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                    code: ({ children }) => (
                      <code className="bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm font-mono">
                        {children}
                      </code>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
              <span
                className={`text-xs mt-2.5 block font-medium ${
                  message.role === "user"
                    ? "text-blue-100/80"
                    : "text-zinc-500 dark:text-zinc-500"
                }`}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            {message.role === "user" && (
              <div className="relative group flex-shrink-0">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur opacity-60 group-hover:opacity-100 transition duration-300" />
                <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                  <User className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-4 justify-start animate-fade-in">
            <div className="relative group flex-shrink-0">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-60 animate-pulse" />
              <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                <Bot className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <div className="bg-white/90 dark:bg-zinc-900/90 border border-zinc-200/50 dark:border-zinc-700/50 rounded-2xl px-5 py-4 shadow-xl backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce animation-delay-100" />
                  <div className="w-2 h-2 bg-pink-600 rounded-full animate-bounce animation-delay-200" />
                </div>
                <span className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                  Thinking...
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Starter Questions */}
        {messages.length === 1 && !isLoading && (
          <div className="mt-8 space-y-4 animate-fade-in">
            <p className="text-sm text-zinc-700 dark:text-zinc-300 font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              Try asking:
            </p>
            <div className="grid gap-3">
              {STARTER_QUESTIONS.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => handleStarterQuestion(question)}
                  className="group text-left px-5 py-4 rounded-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-700/50 hover:border-blue-500/50 dark:hover:border-blue-400/50 transition-all duration-300 text-sm text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-400/10 hover:scale-[1.02] font-medium"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-zinc-400 group-hover:text-blue-500 transition-colors">
                      →
                    </span>
                    {question}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="relative z-10 backdrop-blur-2xl bg-white/60 dark:bg-zinc-900/60 border-t border-white/20 dark:border-zinc-800/50 px-6 py-5 shadow-2xl shadow-black/5">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="flex-1 relative group">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Anupam's skills, projects, or experience..."
              disabled={isLoading}
              className="w-full px-5 py-4 rounded-xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 focus:border-transparent text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-black/5 font-medium text-[15px]"
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="relative group px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 shadow-xl shadow-blue-500/30 dark:shadow-blue-400/20 disabled:shadow-none hover:shadow-2xl hover:scale-105 disabled:hover:scale-100 flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2.5} />
            ) : (
              <Send className="w-5 h-5" strokeWidth={2.5} />
            )}
          </button>
        </form>
        <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-3 text-center font-medium">
          AI-powered responses • May not always be 100% accurate
        </p>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animation-delay-100 {
          animation-delay: 0.1s;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .bg-size-200 {
          background-size: 200%;
        }

        .bg-pos-0 {
          background-position: 0%;
        }

        .bg-pos-100 {
          background-position: 100%;
        }
      `}</style>
    </div>
  );
}
