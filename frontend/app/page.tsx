"use client";

import { useEffect, useRef, useState } from "react";

type Message = { id: string; role: "system" | "user" | "assistant"; content: string; widgetPayload?: any };

// --- NEW WIDGETS ---

const PipelineWidget = ({ data }: { data: any }) => (
  <div className="mt-4 p-5 rounded-xl border border-purple-900/30 bg-neutral-950 shadow-xl font-mono">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-sm text-purple-400 uppercase tracking-widest">Career Funnel</h3>
      <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-400">{data.status}</span>
    </div>
    <div className="flex justify-between text-center gap-2">
      <div className="p-3 bg-neutral-900 rounded flex-1">
        <div className="text-2xl text-white">{data.applications}</div>
        <div className="text-xs text-neutral-500">Applied</div>
      </div>
      <div className="p-3 bg-neutral-900 rounded flex-1 border border-purple-500/30">
        <div className="text-2xl text-white">{data.interviews}</div>
        <div className="text-xs text-purple-400">Interviews</div>
      </div>
      <div className="p-3 bg-neutral-900 rounded flex-1">
        <div className="text-2xl text-white">{data.offers}</div>
        <div className="text-xs text-neutral-500">Offers</div>
      </div>
    </div>
  </div>
);

const SkillTreeWidget = ({ data }: { data: any }) => (
  <div className="mt-4 p-5 rounded-xl border border-amber-900/30 bg-neutral-950 shadow-xl font-mono">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-sm text-amber-400 uppercase tracking-widest">Academic Skill Tree</h3>
      <span className="text-xs text-neutral-500">Current Node: {data.current_node}</span>
    </div>
    <div className="space-y-4">
      <div>
        <div className="text-xs text-amber-500 mb-2 uppercase tracking-wide">Unlocked Paths</div>
        {data.unlocked.map((skill: str, i: number) => (
          <div key={i} className="px-3 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-200 rounded text-sm mb-2">{skill}</div>
        ))}
      </div>
      <div>
        <div className="text-xs text-neutral-600 mb-2 uppercase tracking-wide">Locked Nodes</div>
        {data.locked.map((skill: str, i: number) => (
          <div key={i} className="px-3 py-2 bg-neutral-900 border border-neutral-800 text-neutral-500 rounded text-sm mb-2">{skill}</div>
        ))}
      </div>
    </div>
  </div>
);

const FinanceWidget = ({ data }: { data: any }) => {
  const isDeficit = data.balance < data.dues;
  return (
    <div className="mt-4 p-5 rounded-xl border border-neutral-800 bg-neutral-950 shadow-xl font-mono">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm text-neutral-400 uppercase tracking-widest">Financial Dashboard</h3>
        <span className="text-xs text-neutral-500">Due: {data.next_deadline}</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-neutral-500 mb-1">Available Funds</div>
          <div className="text-2xl text-emerald-400">₹{data.balance.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-xs text-neutral-500 mb-1">Pending Dues</div>
          <div className={`text-2xl ${isDeficit ? 'text-red-400' : 'text-white'}`}>₹{data.dues.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};

// --- EXISTING WIDGETS ---
const AttendanceSimulator = ({ data }: { data: any }) => {
    const [missedSim, setMissedSim] = useState(data.missed || 0);
    const attended = (data.current / 100) * data.total;
    const newTotal = data.total + missedSim;
    const newPercentage = ((attended / newTotal) * 100).toFixed(1);
    const isSafe = parseFloat(newPercentage) >= data.required;
  
    return (
      <div className="mt-4 p-5 rounded-xl border border-neutral-800 bg-neutral-950 shadow-xl font-mono">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm text-neutral-400 uppercase tracking-widest">Attendance Simulator</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${isSafe ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
            {isSafe ? 'SAFE' : 'WARNING'}
          </span>
        </div>
        <div className="flex items-end gap-3 mb-6">
          <div className={`text-4xl font-light ${isSafe ? 'text-white' : 'text-red-400'}`}>{newPercentage}%</div>
          <div className="text-xs text-neutral-500 pb-2">(Required: {data.required}%)</div>
        </div>
        <div className="space-y-3">
          <label className="text-xs text-neutral-400 flex justify-between">
            <span>Simulate Missed Classes:</span><span className="text-white font-bold">{missedSim}</span>
          </label>
          <input type="range" min="0" max="20" value={missedSim} onChange={(e) => setMissedSim(parseInt(e.target.value))} className="w-full accent-emerald-500" />
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
      <div className="mt-4 p-5 rounded-xl border border-blue-900/30 bg-neutral-950 shadow-xl font-mono">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm text-blue-400 uppercase tracking-widest">CGPA Forecaster</h3>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400">CREDITS: {data.credits}</span>
        </div>
        <div className="flex items-end gap-3 mb-6">
          <div className="text-4xl font-light text-white">{projectedCGPA}</div>
          <div className="text-xs text-neutral-500 pb-2">Projected Overall</div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-neutral-400 flex justify-between">
              <span>Next Semester Credits:</span><span className="text-white">{newSemesterCredits}</span>
            </label>
            <input type="range" min="15" max="30" value={newSemesterCredits} onChange={(e) => setNewSemesterCredits(parseInt(e.target.value))} className="w-full accent-blue-500" />
          </div>
          <div>
            <label className="text-xs text-neutral-400 flex justify-between">
              <span>Expected Semester GPA:</span><span className="text-white">{expectedSemesterGPA.toFixed(1)}</span>
            </label>
            <input type="range" min="4.0" max="10.0" step="0.1" value={expectedSemesterGPA} onChange={(e) => setExpectedSemesterGPA(parseFloat(e.target.value))} className="w-full accent-blue-500" />
          </div>
        </div>
      </div>
    );
};

// --- THE DISPATCHER ---
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
    { id: "1", role: "assistant", content: "Core AI initialized. Select a quick action below or type your query." }
  ]);
  const [draft, setDraft] = useState("");
  
  // Explicitly separate network loading from the visual dots state
  const [isNetworkLoading, setIsNetworkLoading] = useState(false);
  const [showThinkingDots, setShowThinkingDots] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, showThinkingDots]);

  const sendQuery = async (userText: string) => {
    if (!userText.trim() || isNetworkLoading) return;
    
    setDraft("");
    setIsNetworkLoading(true);
    setShowThinkingDots(true); // Explicitly turn on dots the moment we send

    const conversationHistory = [...messages, { id: Date.now().toString(), role: "user" as const, content: userText }];
    setMessages(conversationHistory);

    try {
      const res = await fetch("http://localhost:8000/api/chat", {
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
              setShowThinkingDots(false); // Turn off dots exactly when text arrives
              setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }]);
              isFirstChunk = false;
          }

          rawStreamText += decoder.decode(value, { stream: true });
          
          let displayContent = rawStreamText;
          let parsedPayload = undefined;

          if (rawStreamText.includes("[WIDGET_DATA:")) {
            const splitPoint = rawStreamText.indexOf("[WIDGET_DATA:");
            displayContent = rawStreamText.substring(0, splitPoint).trim();
            try {
              const jsonString = rawStreamText.substring(splitPoint + 13, rawStreamText.indexOf("]", splitPoint));
              parsedPayload = JSON.parse(jsonString);
            } catch (e) { /* Ignore partial JSON */ }
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
    <div className="flex flex-col min-h-screen bg-black text-white font-sans selection:bg-neutral-800">
      <header className="p-6 border-b border-neutral-900 bg-black/50 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h1 className="text-sm font-semibold tracking-widest text-neutral-200 uppercase">Core AI // Multi-Widget Engine</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full space-y-6">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-xl p-4 rounded-xl text-sm leading-relaxed border ${
              m.role === "user" ? "bg-neutral-100 text-black border-neutral-200" : "bg-neutral-900/40 text-neutral-200 border-neutral-800/80" 
            }`}>
              {m.content}
              <WidgetDispatcher payload={m.widgetPayload} />
            </div>
          </div>
        ))}
        
        {showThinkingDots && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-xl border bg-neutral-900/40 border-neutral-800/80 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce" />
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </main>

      <div className="p-6 border-t border-neutral-900 bg-black/80 backdrop-blur-md sticky bottom-0">
        <div className="max-w-4xl mx-auto mb-4 flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((prompt, idx) => (
                <button 
                    key={idx}
                    onClick={() => sendQuery(prompt)}
                    disabled={isNetworkLoading}
                    className="text-xs bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
                >
                    {prompt}
                </button>
            ))}
        </div>
        <form onSubmit={handleFormSubmit} className="flex gap-3 max-w-4xl mx-auto">
          <input className="flex-1 bg-neutral-900 border border-neutral-800 text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-neutral-500 transition-colors placeholder:text-neutral-600" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Type a message or select a prompt..." disabled={isNetworkLoading} />
          <button type="submit" disabled={isNetworkLoading} className="bg-neutral-100 text-black px-5 py-3 rounded-lg font-mono disabled:opacity-50 transition-opacity">EXECUTE</button>
        </form>
      </div>
    </div>
  );
}