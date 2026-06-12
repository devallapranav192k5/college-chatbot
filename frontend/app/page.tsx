"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

type Message = { id: string; role: "system" | "user" | "assistant"; content: string; widgetPayload?: any };

// --- WIDGETS ---
const PipelineWidget = ({ data }: { data: any }) => (
  <div className="mt-6 p-5 rounded-xl border border-purple-900/30 bg-neutral-950/80 shadow-2xl font-mono animate-fade-in-up backdrop-blur-sm">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-sm text-purple-400 uppercase tracking-widest font-bold">Career Funnel</h3>
      <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">{data.status}</span>
    </div>
    <div className="flex justify-between text-center gap-3">
      <div className="p-4 bg-neutral-900/80 rounded-lg flex-1 border border-neutral-800 transition-all hover:border-purple-500/30">
        <div className="text-3xl text-white font-light">{data.applications}</div>
        <div className="text-xs text-neutral-500 mt-1 uppercase tracking-wide">Applied</div>
      </div>
      <div className="p-4 bg-purple-900/10 rounded-lg flex-1 border border-purple-500/30 transition-all hover:bg-purple-900/20">
        <div className="text-3xl text-white font-light">{data.interviews}</div>
        <div className="text-xs text-purple-400 mt-1 uppercase tracking-wide">Interviews</div>
      </div>
      <div className="p-4 bg-neutral-900/80 rounded-lg flex-1 border border-neutral-800 transition-all hover:border-purple-500/30">
        <div className="text-3xl text-white font-light">{data.offers}</div>
        <div className="text-xs text-neutral-500 mt-1 uppercase tracking-wide">Offers</div>
      </div>
    </div>
  </div>
);

const SkillTreeWidget = ({ data }: { data: any }) => (
  <div className="mt-6 p-5 rounded-xl border border-amber-900/30 bg-neutral-950/80 shadow-2xl font-mono animate-fade-in-up backdrop-blur-sm">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-sm text-amber-400 uppercase tracking-widest font-bold">Academic Skill Tree</h3>
      <span className="text-[10px] text-neutral-500 uppercase tracking-widest bg-neutral-900 px-2 py-1 rounded border border-neutral-800">Node: {data.current_node}</span>
    </div>
    <div className="space-y-5">
      <div>
        <div className="text-[10px] text-amber-500/70 mb-2 uppercase tracking-widest font-bold flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> Unlocked Paths
        </div>
        <div className="flex flex-wrap gap-2">
            {data.unlocked.map((skill: string, i: number) => (
            <div key={i} className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-md text-xs">{skill}</div>
            ))}
        </div>
      </div>
      <div>
        <div className="text-[10px] text-neutral-600 mb-2 uppercase tracking-widest font-bold flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-neutral-600"></div> Locked Nodes
        </div>
        <div className="flex flex-wrap gap-2">
            {data.locked.map((skill: string, i: number) => (
            <div key={i} className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 text-neutral-500 rounded-md text-xs">{skill}</div>
            ))}
        </div>
      </div>
    </div>
  </div>
);

const FinanceWidget = ({ data }: { data: any }) => {
  const isDeficit = data.balance < data.dues;
  return (
    <div className="mt-6 p-5 rounded-xl border border-neutral-800 bg-neutral-950/80 shadow-2xl font-mono animate-fade-in-up backdrop-blur-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm text-neutral-400 uppercase tracking-widest font-bold">Financial Dashboard</h3>
        <span className="text-xs text-neutral-500 bg-neutral-900 px-2 py-1 rounded border border-neutral-800">Due: {data.next_deadline}</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-neutral-900/50 rounded-lg border border-neutral-800">
          <div className="text-xs text-neutral-500 mb-1 uppercase tracking-wide">Available Funds</div>
          <div className="text-2xl text-emerald-400 font-light">₹{data.balance.toLocaleString()}</div>
        </div>
        <div className="p-4 bg-neutral-900/50 rounded-lg border border-neutral-800">
          <div className="text-xs text-neutral-500 mb-1 uppercase tracking-wide">Pending Dues</div>
          <div className={`text-2xl font-light ${isDeficit ? 'text-red-400' : 'text-white'}`}>₹{data.dues.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};

const GPACalculator = ({ data }: { data: any }) => {
    const [newSemesterCredits, setNewSemesterCredits] = useState(20);
    const [expectedSemesterGPA, setExpectedSemesterGPA] = useState(8.5);
    const totalPoints = (data.current_cgpa * data.credits) + (expectedSemesterGPA * newSemesterCredits);
    const newTotalCredits = data.credits + newSemesterCredits;
    const projectedCGPA = (totalPoints / newTotalCredits).toFixed(2);
  
    return (
      <div className="mt-6 p-5 rounded-xl border border-blue-900/30 bg-neutral-950/80 shadow-2xl font-mono animate-fade-in-up backdrop-blur-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm text-blue-400 uppercase tracking-widest font-bold">CGPA Forecaster</h3>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">CREDITS: {data.credits}</span>
        </div>
        <div className="flex items-end gap-3 mb-8 pb-6 border-b border-neutral-800">
          <div className="text-5xl font-light text-white tracking-tight">{projectedCGPA}</div>
          <div className="text-xs text-neutral-500 pb-2 uppercase tracking-wide">Projected Overall</div>
        </div>
        <div className="space-y-6">
          <div>
            <label className="text-xs text-neutral-400 flex justify-between mb-2 font-bold uppercase tracking-wide">
              <span>Next Semester Credits</span><span className="text-white bg-neutral-800 px-2 py-0.5 rounded">{newSemesterCredits}</span>
            </label>
            <input type="range" min="15" max="30" value={newSemesterCredits} onChange={(e) => setNewSemesterCredits(parseInt(e.target.value))} className="w-full accent-blue-500 h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer" />
          </div>
          <div>
            <label className="text-xs text-neutral-400 flex justify-between mb-2 font-bold uppercase tracking-wide">
              <span>Expected Semester GPA</span><span className="text-white bg-neutral-800 px-2 py-0.5 rounded">{expectedSemesterGPA.toFixed(1)}</span>
            </label>
            <input type="range" min="4.0" max="10.0" step="0.1" value={expectedSemesterGPA} onChange={(e) => setExpectedSemesterGPA(parseFloat(e.target.value))} className="w-full accent-blue-500 h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer" />
          </div>
        </div>
      </div>
    );
};

const AttendanceSimulator = ({ data }: { data: any }) => {
    const [missedSim, setMissedSim] = useState(data.missed || 0);
    const [isSaving, setIsSaving] = useState(false);
    
    const attended = (data.current / 100) * data.total;
    const newTotal = data.total + missedSim;
    const newPercentage = ((attended / newTotal) * 100).toFixed(1);
    const isSafe = parseFloat(newPercentage) >= data.required;

    const syncDatabase = async () => {
        setIsSaving(true);
        try {
            await fetch("https://core-ai-engine.onrender.com/api/sync-data", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ attendance_percentage: parseFloat(newPercentage) })
            });
            setTimeout(() => setIsSaving(false), 800);
        } catch (e) { setIsSaving(false); }
    };
  
    return (
      <div className="mt-6 p-5 rounded-xl border border-neutral-800 bg-neutral-950/80 shadow-2xl font-mono animate-fade-in-up backdrop-blur-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm text-neutral-400 uppercase tracking-widest font-bold">Attendance Simulator</h3>
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${isSafe ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
            {isSafe ? 'SAFE' : 'WARNING'}
          </span>
        </div>
        <div className="flex justify-between items-end mb-8 pb-6 border-b border-neutral-800">
            <div className="flex items-end gap-3">
                <div className={`text-5xl font-light tracking-tight ${isSafe ? 'text-white' : 'text-red-400'}`}>{newPercentage}%</div>
                <div className="text-xs text-neutral-500 pb-2 uppercase tracking-wide">(Req: {data.required}%)</div>
            </div>
            <button onClick={syncDatabase} disabled={isSaving} className="text-[10px] font-bold tracking-widest bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg transition-all disabled:opacity-50">
                {isSaving ? "SYNCING..." : "COMMIT TO DB"}
            </button>
        </div>
        <div className="space-y-4">
          <label className="text-xs text-neutral-400 flex justify-between font-bold uppercase tracking-wide">
            <span>Simulate Missed Classes</span><span className="text-white bg-neutral-800 px-2 py-0.5 rounded">{missedSim}</span>
          </label>
          <input type="range" min="0" max="20" value={missedSim} onChange={(e) => setMissedSim(parseInt(e.target.value))} className="w-full accent-emerald-500 h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer" />
        </div>
      </div>
    );
};
  
const WidgetDispatcher = ({ payload }: { payload: any }) => {
  if (!payload || !payload.type || !payload.data) return null;
  switch (payload.type) {
    case "SIMULATOR": return <AttendanceSimulator data={payload.data} />;
    case "CALCULATOR": return <GPACalculator data={payload.data} />;
    case "PIPELINE": return <PipelineWidget data={payload.data} />;
    case "SKILL_TREE": return <SkillTreeWidget data={payload.data} />;
    case "FINANCE": return <FinanceWidget data={payload.data} />;
    default: return null;
  }
};

const QUICK_PROMPTS = [
  "Calculate how many classes I can miss",
  "What GPA do I need this semester?",
  "Show my internship application status",
  "What skills should I learn next?",
  "Check my pending fee dues"
];

export default function CollegeChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "assistant", content: "Core AI initialized. Accessing primary database... Ready." }
  ]);
  const [draft, setDraft] = useState("");
  const [isNetworkLoading, setIsNetworkLoading] = useState(false);
  const [showThinkingDots, setShowThinkingDots] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, showThinkingDots]);

  const sendQuery = async (userText: string) => {
    if (!userText.trim() || isNetworkLoading) return;
    setDraft("");
    setIsNetworkLoading(true);
    setShowThinkingDots(true);

    const conversationHistory = [...messages, { id: Date.now().toString(), role: "user" as const, content: userText }];
    setMessages(conversationHistory);

    try {
      const res = await fetch("https://core-ai-engine.onrender.com/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: conversationHistory }),
      });

      if (!res.ok || !res.body) throw new Error("Backend connection failed.");

      const assistantId = (Date.now() + 1).toString();
      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let rawStreamText = "";
      let isFirstChunk = true;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          if (isFirstChunk) {
              setShowThinkingDots(false);
              setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }]);
              isFirstChunk = false;
          }
          rawStreamText += decoder.decode(value, { stream: true });
          
          let displayContent = rawStreamText;
          let parsedPayload = undefined;

          if (rawStreamText.includes("||WIDGET_DATA:")) {
            const splitPoint = rawStreamText.indexOf("||WIDGET_DATA:");
            displayContent = rawStreamText.substring(0, splitPoint).trim();
            try {
              const startIdx = splitPoint + 14;
              const endIdx = rawStreamText.indexOf("||", startIdx);
              if (endIdx !== -1) {
                  const jsonString = rawStreamText.substring(startIdx, endIdx);
                  parsedPayload = JSON.parse(jsonString);
              }
            } catch (e) { }
          }

          setMessages((prev) => prev.map((msg) =>
            msg.id === assistantId ? { ...msg, content: displayContent, widgetPayload: parsedPayload || msg.widgetPayload } : msg
          ));
        }
      }
    } catch (error) { 
        console.error(error); 
        setShowThinkingDots(false);
    } finally { 
        setIsNetworkLoading(false); 
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendQuery(draft);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a] text-neutral-200 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      <header className="p-5 border-b border-neutral-800/50 bg-black/60 backdrop-blur-xl sticky top-0 z-10 flex items-center justify-between shadow-2xl">
        <div className="flex flex-col">
            <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse-slow shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <h1 className="text-sm font-bold tracking-widest text-neutral-100 uppercase font-mono">Core AI // Interface</h1>
            </div>
            <p className="text-[10px] text-neutral-500 mt-1 uppercase tracking-widest ml-5 font-mono">ID: 2023002505 | V 2.2.0</p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full space-y-8 scroll-smooth">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}>
            <div className={`max-w-2xl p-5 rounded-2xl text-[15px] border shadow-lg ${
              m.role === "user" 
              ? "bg-neutral-100 text-black border-transparent rounded-tr-sm font-medium" 
              : "bg-neutral-900/40 text-neutral-200 border-neutral-800/80 rounded-tl-sm backdrop-blur-sm" 
            }`}>
              
              {m.role === "user" ? (
                m.content
              ) : (
                <div className="markdown-body">
                  <ReactMarkdown 
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      h3: ({node, ...props}) => <h3 className="text-emerald-400 font-bold uppercase tracking-widest text-[11px] mt-6 mb-3 border-b border-emerald-900/30 pb-2" {...props} />,
                      strong: ({node, ...props}) => <strong className="text-white font-bold bg-neutral-800/80 px-1.5 py-0.5 rounded border border-neutral-700 shadow-sm" {...props} />,
                      p: ({node, ...props}) => <p className="mb-4 last:mb-0 leading-relaxed text-[14px] text-neutral-300" {...props} />,
                      ul: ({node, ...props}) => <ul className="space-y-3 mb-4 ml-2" {...props} />,
                      ol: ({node, ...props}) => <ol className="space-y-3 mb-4 ml-4 list-decimal marker:text-emerald-500 marker:font-bold" {...props} />,
                      li: ({node, ...props}) => <li className="text-[14px] leading-relaxed text-neutral-300" {...props} />
                    }}
                  >
                    {m.content}
                  </ReactMarkdown>
                </div>
              )}

              <WidgetDispatcher payload={m.widgetPayload} />
            </div>
          </div>
        ))}
        
        {showThinkingDots && (
          <div className="flex justify-start animate-fade-in-up">
            <div className="px-5 py-4 rounded-2xl rounded-tl-sm border bg-neutral-900/40 border-neutral-800/80 flex items-center gap-2 backdrop-blur-sm shadow-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 animate-bounce" />
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </main>

      <div className="p-6 border-t border-neutral-800/50 bg-black/80 backdrop-blur-xl sticky bottom-0 z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="max-w-4xl mx-auto mb-5 flex flex-wrap gap-2.5">
            {QUICK_PROMPTS.map((prompt, idx) => (
                <button 
                    key={idx}
                    onClick={() => sendQuery(prompt)}
                    disabled={isNetworkLoading}
                    className="text-xs font-mono bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700 hover:text-white text-neutral-400 px-4 py-2 rounded-full transition-all duration-300 disabled:opacity-50 disabled:hover:bg-neutral-900 shadow-sm"
                >
                    {prompt}
                </button>
            ))}
        </div>
        <form onSubmit={handleFormSubmit} className="flex gap-3 max-w-4xl mx-auto relative group">
          <input 
            className="flex-1 bg-neutral-900/50 border border-neutral-800 text-[15px] font-mono rounded-xl pl-5 pr-4 py-4 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 focus:bg-neutral-900 transition-all placeholder:text-neutral-600 shadow-inner" 
            value={draft} 
            onChange={(e) => setDraft(e.target.value)} 
            placeholder="Awaiting directive..." 
            disabled={isNetworkLoading} 
          />
          <button 
            type="submit" 
            disabled={isNetworkLoading} 
            className="bg-neutral-100 hover:bg-white hover:scale-[1.02] active:scale-[0.98] text-black px-8 py-4 rounded-xl font-mono font-bold tracking-widest text-xs uppercase disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            Execute
          </button>
        </form>
      </div>
    </div>
  );
}