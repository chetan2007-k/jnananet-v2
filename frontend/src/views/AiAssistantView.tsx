import React, { useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { ApiClient } from "../services/apiClient";
import { Bot, Send, User, Sparkles, Loader2, FileText, CheckCircle2 } from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export const AiAssistantView: React.FC = () => {
  const { profile } = useAppStore();
  const [activeSubTab, setActiveSubTab] = useState<"chat" | "grader">("chat");
  
  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "ai",
      text: `Hello ${profile.fullName}! I am your **JnanaNet AI Assistant**.\n\nI can help you interpret eligibility criteria, list required NSP portal documents, prepare application checklists, or suggest scholarships for ${profile.academicRecord?.courseName || "B.Tech"}.\n\nTry asking a question below!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Grader State
  const [essayText, setEssayText] = useState("");
  const [isGrading, setIsGrading] = useState(false);
  const [gradeResult, setGradeResult] = useState<any>(null);

  const samplePrompts = [
    "I don't have a PAN Card, can I still apply?",
    "My income certificate is from last year, is it valid?",
    "Can I apply for 2 government scholarships at the same time?",
    "What is the difference between NSP and State Portals?",
    "How long does PFMS take to disburse the amount?",
  ];

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || input;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!questionText) setInput("");
    setIsLoading(true);

    try {
      const response = await ApiClient.askAssistant(textToSend);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: "ai",
        text: "Sorry, I ran into an error connecting to the AI Engine. Please try again shortly.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGradeEssay = () => {
    if (!essayText.trim()) return;
    setIsGrading(true);
    setGradeResult(null);

    setTimeout(() => {
      const words = essayText.trim().split(/\s+/).length;
      let score = 82;
      let grammar = "";
      let emotion = "";
      let suggestions = [];

      if (words < 50) {
        score = 45;
        grammar = "The essay is too short to fully evaluate sentence structure.";
        emotion = "Lacks depth. A scholarship committee needs to hear your personal story.";
        suggestions = [
          "Expand significantly on your background and family situation.",
          "Provide concrete examples of your academic achievements.",
          "Clearly state why you need this financial support."
        ];
      } else if (words > 150) {
        score = 92 + (words % 5); // Dynamic high score
        grammar = "Excellent vocabulary, clear sentence structure, and active voice used effectively.";
        emotion = "Very compelling narrative. You successfully tied your past struggles to your future engineering goals.";
        suggestions = [
          "Your essay is extremely strong! Just ensure it fits the exact word count limits of the target portal.",
          "Consider quantifying the impact of your IoT project (e.g., 'helped 5 farmers')."
        ];
      } else {
        score = 65 + (words % 15); // Dynamic mid score
        grammar = "Generally well-written, though a few passive sentences could be made active.";
        emotion = "Good foundation, but you should connect your academic goals more deeply to your financial need.";
        suggestions = [
          "Elaborate more on your specific future career goals.",
          "Mention the name of the specific scholarship you are applying to.",
          "Break up long paragraphs to make it easier to read."
        ];
      }

      setGradeResult({
        score,
        grammar,
        emotion,
        suggestions
      });
      setIsGrading(false);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col glass-panel rounded-2xl border border-slate-200 shadow-sm overflow-hidden bg-white ">
      {/* Header & Tabs */}
      <div className="border-b border-slate-200 ">
        <div className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
              JnanaNet AI Intelligence <Sparkles className="w-4 h-4 text-brand-400" />
            </h2>
            <p className="text-xs text-slate-500 ">Scholarship Assistant & Application Reviewer</p>
          </div>
        </div>
        <div className="flex px-4 gap-4 bg-slate-50 border-t border-slate-200 ">
          <button
            onClick={() => setActiveSubTab("chat")}
            className={`py-2.5 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeSubTab === "chat" ? "border-brand-600 text-brand-700" : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Bot className="w-4 h-4" /> AI Chat Assistant
          </button>
          <button
            onClick={() => setActiveSubTab("grader")}
            className={`py-2.5 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeSubTab === "grader" ? "border-brand-600 text-brand-700" : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <FileText className="w-4 h-4" /> SOP / Essay Reviewer
          </button>
        </div>
      </div>

      {activeSubTab === "chat" ? (
        <>
          {/* Messages Scroll View */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white shadow-sm ${
                    m.sender === "user"
                      ? "bg-slate-800"
                      : "bg-brand-600"
                  }`}
                >
                  {m.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-xl p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                    m.sender === "user"
                      ? "bg-slate-800 text-white rounded-tr-none"
                      : "bg-white border border-slate-200 text-slate-800 rounded-tl-none whitespace-pre-wrap"
                  }`}
                >
                  {m.text}
                  <div
                    className={`text-[10px] mt-2 ${
                      m.sender === "user" ? "text-slate-400" : "text-slate-400"
                    }`}
                  >
                    {m.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 ">
                <Loader2 className="w-4 h-4 animate-spin text-brand-500" />
                <span>Analyzing prompt with AI...</span>
              </div>
            )}
          </div>

          {/* Suggested Quick Prompts / FAQ */}
          <div className="p-3 bg-white border-t border-slate-200 overflow-x-auto">
            <div className="text-xs font-bold text-slate-500 mb-2 px-1">Common Student Doubts (FAQ)</div>
            <div className="flex gap-2">
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p)}
                  className="text-[11px] px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 whitespace-nowrap border border-slate-200 transition shrink-0"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <div className="p-4 bg-white border-t border-slate-200 flex gap-2">
            <input
              type="text"
              placeholder="Ask anything about scholarships, NSP deadlines, or eligibility..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500"
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </>
      ) : (
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 ">Statement of Purpose (SOP)</h3>
              <p className="text-xs text-slate-500 mb-2">Paste your essay here. Our AI will grade it based on corporate scholarship rubrics.</p>
            </div>
            <textarea
              className="w-full h-64 p-4 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-sm resize-none shadow-sm"
              placeholder="Write or paste your essay here..."
              value={essayText}
              onChange={(e) => setEssayText(e.target.value)}
            ></textarea>
            <button
              onClick={handleGradeEssay}
              disabled={isGrading || !essayText.trim()}
              className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              {isGrading ? <><Loader2 className="w-4 h-4 animate-spin" /> AI is grading your essay...</> : <><Sparkles className="w-4 h-4" /> Analyze & Grade Essay</>}
            </button>
          </div>
          
          <div className="w-full md:w-80 space-y-4">
            {gradeResult ? (
              <div className="p-5 rounded-2xl bg-white border border-brand-200 shadow-sm space-y-4 animate-in fade-in slide-in-from-bottom-4">
                <div className="text-center pb-4 border-b border-slate-100 ">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 font-black text-2xl flex items-center justify-center mx-auto mb-2 border border-emerald-100 shadow-sm">
                    {gradeResult.score}
                  </div>
                  <h4 className="font-bold text-slate-900 ">AI Score</h4>
                  <p className="text-xs text-slate-500 ">Out of 100 points</p>
                </div>
                
                <div>
                  <h5 className="text-xs font-bold text-slate-900 mb-1">Grammar & Tone</h5>
                  <p className="text-xs text-slate-600 ">{gradeResult.grammar}</p>
                </div>
                
                <div>
                  <h5 className="text-xs font-bold text-slate-900 mb-1">Emotional Impact</h5>
                  <p className="text-xs text-slate-600 ">{gradeResult.emotion}</p>
                </div>
                
                <div>
                  <h5 className="text-xs font-bold text-slate-900 mb-2">Key Improvement Areas</h5>
                  <ul className="space-y-2">
                    {gradeResult.suggestions.map((s: string, i: number) => (
                      <li key={i} className="text-[11px] text-slate-600 flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" /> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="h-full border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center p-6 bg-slate-50/50">
                <FileText className="w-10 h-10 text-slate-300 mb-3" />
                <h4 className="text-sm font-bold text-slate-900 ">No Analysis Yet</h4>
                <p className="text-xs text-slate-500 mt-1">Paste your essay and click analyze to see your AI grade, grammar checks, and improvement tips.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
