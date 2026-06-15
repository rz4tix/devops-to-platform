import React, { useState, useEffect } from "react";
import { 
  Download, 
  CheckCircle, 
  BookOpen, 
  Terminal, 
  Cpu, 
  Award, 
  ShieldCheck, 
  Activity, 
  Sparkles, 
  ChevronRight, 
  ChevronDown, 
  Calendar, 
  Clock, 
  ExternalLink,
  BookMarked,
  Layers,
  Flame,
  UserCheck,
  AlertOctagon
} from "lucide-react";
import { roadmapData, MonthData, WeekData, DailyTask } from "./data/roadmapData";
import IncidentSimulator from "./components/IncidentSimulator";

export default function App() {
  const [activeMonthId, setActiveMonthId] = useState<number>(1);
  const [expandedWeekId, setExpandedWeekId] = useState<number>(1);
  const [expandedDayId, setExpandedDayId] = useState<number | null>(1); // Default show Day 1

  // LocalStorage state trackers
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [completedCapstones, setCompletedCapstones] = useState<number[]>([]);

  useEffect(() => {
    try {
      const storedProgress = localStorage.getItem("sre_roadmap_progress");
      if (storedProgress) {
        const parsed = JSON.parse(storedProgress);
        if (parsed.days) setCompletedDays(parsed.days);
        if (parsed.capstones) setCompletedCapstones(parsed.capstones);
      }
    } catch (e) {
      console.error("Failed to load progress states", e);
    }
  }, []);

  const saveProgress = (updatedDays: number[], updatedCapstones: number[]) => {
    localStorage.setItem(
      "sre_roadmap_progress",
      JSON.stringify({ days: updatedDays, capstones: updatedCapstones })
    );
  };

  const toggleDayCompletion = (dayNum: number) => {
    const isCompleted = completedDays.includes(dayNum);
    let newCompleted;
    if (isCompleted) {
      newCompleted = completedDays.filter((d) => d !== dayNum);
    } else {
      newCompleted = [...completedDays, dayNum];
    }
    setCompletedDays(newCompleted);
    saveProgress(newCompleted, completedCapstones);
  };

  const toggleCapstoneCompletion = (monthNum: number) => {
    const isCompleted = completedCapstones.includes(monthNum);
    let newCapstones;
    if (isCompleted) {
      newCapstones = completedCapstones.filter((m) => m !== monthNum);
    } else {
      newCapstones = [...completedCapstones, monthNum];
    }
    setCompletedCapstones(newCapstones);
    saveProgress(completedDays, newCapstones);
  };

  // Calculations for analytics
  const totalDays = roadmapData.reduce((acc, m) => {
    return acc + m.weeks.reduce((accW, w) => accW + (w.days ? w.days.length : 0), 0);
  }, 0);
  const completionPercentage = Math.round((completedDays.length / (totalDays || 1)) * 100);

  const activeMonthData = roadmapData.find((m) => m.monthNum === activeMonthId) || roadmapData[0];
  const activeWeekData = activeMonthData.weeks.find((w) => w.weekNum === expandedWeekId) || activeMonthData.weeks[0];

  useEffect(() => {
    // When month changes, set expanded week to the first week of that month
    if (activeMonthData.weeks.length > 0) {
      const firstWeek = activeMonthData.weeks[0].weekNum;
      setExpandedWeekId(firstWeek);
      // Select first day of that week to expand
      const weekDays = activeMonthData.weeks[0].days;
      if (weekDays && weekDays.length > 0) {
        setExpandedDayId(weekDays[0].dayNum);
      } else {
        setExpandedDayId(null);
      }
    }
  }, [activeMonthId]);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col antialiased text-slate-900 selection:bg-indigo-600 selection:text-indigo-50">
      
      {/* Top Navigation Frame */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-indigo-600 to-indigo-500 rounded-lg shadow flex items-center justify-center">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-slate-800 uppercase font-sans">
              SRE & Platform Engineering Portal
            </h1>
            <p className="text-[10px] text-slate-500 font-mono tracking-wide uppercase">
              DevOps → SRE → AI-Integrated Systems
            </p>
          </div>
        </div>

        {/* Global Progress Metrics */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">Roadmap Progress</span>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-32 bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-205">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-500" 
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <span className="text-xs font-bold font-mono text-emerald-600">{completionPercentage}%</span>
            </div>
          </div>

          <a 
            href="/README.md" 
            download 
            className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-xs font-semibold rounded-lg border border-slate-240 text-slate-700 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download README</span>
          </a>
        </div>
      </header>

      {/* Primary Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Syllabus and Tasks (8 Cols on Desktop) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6" id="syllabus_pane">
          
          {/* Month Selector Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 shrink-0">
            {roadmapData.map((month) => (
              <button
                key={month.monthNum}
                onClick={() => setActiveMonthId(month.monthNum)}
                className={`px-4 py-2 text-xs font-bold font-mono rounded-lg transition-all border whitespace-nowrap cursor-pointer ${
                  activeMonthId === month.monthNum
                    ? "bg-indigo-50 border-indigo-550 text-indigo-700 shadow-sm font-semibold"
                    : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800"
                }`}
              >
                Month {month.monthNum}: {month.title.split("&")[0]}
              </button>
            ))}
          </div>

          {/* Month Overview Descriptor */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 relative overflow-hidden shrink-0 shadow-sm">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
              <Layers className="w-32 h-32 text-indigo-600" />
            </div>
            <h2 className="text-xs font-bold font-mono text-indigo-600 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-550" /> Month {activeMonthId} Syllabus Focus
            </h2>
            <h3 className="text-base font-bold text-slate-800 mb-2">{activeMonthData.title}</h3>
            <p className="text-xs text-slate-650 leading-relaxed font-sans">{activeMonthData.overview}</p>
          </div>

          {/* Weeks Accordion Sidebar */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-wider">Weekly Modules</h4>
            
            <div className="grid grid-cols-1 gap-3">
              {activeMonthData.weeks.map((week) => {
                const isExpanded = expandedWeekId === week.weekNum;
                return (
                  <div 
                    key={week.weekNum}
                    className={`border rounded-lg transition-all overflow-hidden ${
                      isExpanded 
                        ? "bg-white border-slate-300 shadow-sm" 
                        : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
                    }`}
                  >
                    {/* Header trigger */}
                    <div 
                      onClick={() => setExpandedWeekId(week.weekNum)}
                      className="px-4 py-3 cursor-pointer flex items-center justify-between select-none hover:bg-slate-50/30"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 font-mono text-[10px] font-bold rounded ${
                          isExpanded ? "bg-indigo-50 text-indigo-600 border border-indigo-200" : "bg-slate-100 text-slate-500"
                        }`}>
                          WEEK {week.weekNum}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-slate-700">{week.theme}</h4>
                          <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{week.summary}</p>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? "rotate-90 text-indigo-550" : ""}`} />
                    </div>
                    {/* Expandable week scope */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-1 border-t border-slate-200 flex flex-col gap-4 bg-slate-50/20">
                        
                        {/* Weekly tools & AWS Integration block */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                          <div>
                            <span className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-wider">Primary Tools</span>
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              {week.primaryTools.map((t, idx) => (
                                <span key={idx} className="px-2 py-0.5 bg-white border border-slate-200 text-[10px] font-mono text-indigo-600 rounded">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                          {week.awsThread && (
                            <div>
                              <span className="text-[10px] font-bold font-mono text-indigo-600 uppercase tracking-wider">AWS / EKS Connection Thread</span>
                              <p className="text-[10px] text-slate-600 mt-1.5 font-sans leading-relaxed">{week.awsThread}</p>
                            </div>
                          )}
                        </div>

                        {/* Daily Tasks for the week */}
                        <div className="space-y-3 mt-1">
                          <span className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-wider block mb-2">Daily Missions</span>
                          
                          {week.days && week.days.length > 0 ? (
                            week.days.map((day) => {
                              const isCompleted = completedDays.includes(day.dayNum);
                              const isDayExpanded = expandedDayId === day.dayNum;

                              return (
                                <div 
                                  key={day.dayNum}
                                  className={`rounded-lg border transition-all ${
                                    isCompleted 
                                      ? "bg-emerald-50/10 border-emerald-250" 
                                      : "bg-white border-slate-200"
                                  }`}
                                >
                                  {/* Day Row Header */}
                                  <div className="px-3 py-2.5 flex items-center justify-between gap-3 select-none">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                      {/* Checkbox */}
                                      <button 
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleDayCompletion(day.dayNum);
                                        }}
                                        className="focus:outline-none focus:ring-0 shrink-0 cursor-pointer"
                                      >
                                        <CheckCircle className={`w-5 h-5 transition-all ${
                                          isCompleted ? "text-emerald-500 scale-110" : "text-slate-300 hover:text-slate-400"
                                        }`} />
                                      </button>

                                      <div 
                                        onClick={() => setExpandedDayId(isDayExpanded ? null : day.dayNum)}
                                        className="flex-1 min-w-0 cursor-pointer"
                                      >
                                        <div className="flex items-center gap-2">
                                          <span className="text-[10px] font-bold font-mono text-slate-500 shrink-0">Day {day.dayNum}</span>
                                          <span className="text-[10px] font-mono text-slate-600 border border-slate-200 px-1.5 py-0.2 rounded-full bg-slate-50 flex items-center gap-1"><Clock className="w-3 h-3 text-slate-400" /> {day.timeEstimate}</span>
                                        </div>
                                        <h5 className="text-[11px] font-bold text-slate-800 mt-0.5 truncate">{day.title}</h5>
                                      </div>
                                    </div>

                                    <button
                                      onClick={() => setExpandedDayId(isDayExpanded ? null : day.dayNum)}
                                      className="p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                                    >
                                      {isDayExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                    </button>
                                  </div>

                                  {/* Nested Day Details */}
                                  {isDayExpanded && (
                                    <div className="px-3 pb-4 pt-1 border-t border-slate-200 bg-slate-50/50 rounded-b-lg text-[11px] flex flex-col gap-3.5 font-sans">
                                      
                                      {/* Context */}
                                      <div>
                                        <span className="font-bold text-slate-700 block mb-1">Context / Why</span>
                                        <p className="text-slate-600 leading-relaxed text-[11px]">{day.context}</p>
                                      </div>

                                      {/* Theory */}
                                      <div className="bg-white p-2.5 rounded border border-slate-200">
                                        <span className="font-bold text-indigo-600 font-mono text-[10px] uppercase block mb-1.5">Theory & Concept Checklist</span>
                                        <ul className="list-disc pl-4 space-y-1.5 text-slate-600">
                                          {day.theory.concepts.map((c, i) => <li key={i}>{c}</li>)}
                                        </ul>
                                        <div className="mt-2.5 border-t border-slate-200/80 pt-2 flex flex-col gap-1 text-[10px]">
                                          <span className="text-slate-400 font-bold font-mono uppercase tracking-wide">Recommended Reading:</span>
                                          {day.theory.readings.map((r, i) => (
                                            <span key={i} className="text-slate-600 flex items-center gap-1">▪ {r}</span>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Lab Steps */}
                                      <div className="bg-white p-2.5 rounded border border-slate-200">
                                        <span className="font-bold text-emerald-600 font-mono text-[10px] uppercase block mb-1.5">Hands-on Lab Exercise</span>
                                        <div className="p-2 bg-slate-50 rounded border border-slate-200/60 mb-2">
                                          <span className="text-slate-400 block font-bold font-mono text-[9px] uppercase tracking-wider mb-0.5 text-indigo-500">Scenario Context</span>
                                          <p className="text-slate-600 leading-relaxed text-[11px]">{day.lab.scenario}</p>
                                        </div>
                                        <span className="text-slate-500 block font-bold text-[10px] mb-1">Step-by-step Procedures</span>
                                        <ol className="list-decimal pl-4 space-y-1.5 text-slate-600">
                                          {day.lab.steps.map((s, i) => <li key={i}>{s}</li>)}
                                        </ol>
                                        <div className="mt-3 bg-indigo-50/50 border border-indigo-100 p-2 rounded text-[10px]">
                                          <span className="font-bold text-indigo-600 block font-mono uppercase mb-0.5">Stretch Goal</span>
                                          <p className="text-slate-600 font-sans">{day.lab.stretchGoal}</p>
                                        </div>
                                      </div>

                                      {/* Deliverable & Pitfalls */}
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                        <div className="bg-slate-50/40 p-2.5 rounded border border-slate-200">
                                          <span className="font-bold text-slate-700 block mb-1">Target Deliverable</span>
                                          <p className="text-slate-600 leading-relaxed font-mono text-[10px]">{day.deliverable}</p>
                                        </div>
                                        <div className="bg-rose-50/20 p-2.5 rounded border border-rose-150">
                                          <span className="font-bold text-rose-700 block mb-1">Common SRE Pitfalls</span>
                                          <ul className="list-disc pl-4 space-y-1 text-slate-600 leading-relaxed">
                                            {day.pitfalls.map((p, i) => <li key={i}>{p}</li>)}
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          ) : (
                            /* Month 2-5 place holder cards */
                            <div className="p-4 bg-white border border-dashed border-slate-200 rounded-lg text-center py-8 shadow-sm">
                              <Calendar className="w-8 h-8 text-slate-350 mx-auto mb-2" />
                              <h5 className="text-xs font-semibold text-slate-600 mb-0.5 font-sans">Static Syllabus for This Month</h5>
                              <p className="text-[10px] text-slate-500 max-w-sm mx-auto leading-relaxed font-sans">
                                Months 2 through 5 are fully outlined in your generated root <code className="text-slate-500 font-mono text-[9px]">README.md</code>. Read through intermediate modules, and configure your local Kubernetes cluster properties sequentially.
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Sunday Review for expanded week */}
                        {week.sundayReview && week.sundayReview.quizQuestions && week.sundayReview.quizQuestions.length > 0 && (
                          <div className="border border-indigo-100 bg-indigo-50/40 rounded-lg p-4 mt-2">
                            <h5 className="text-xs font-bold font-mono text-indigo-700 mb-2 flex items-center gap-1.5"><Award className="w-4 h-4" /> Sunday Review Session</h5>
                            
                            <div className="space-y-3 text-[11px] font-sans">
                              {/* Mini Task */}
                              <div>
                                <span className="font-bold text-slate-700 uppercase font-mono text-[9px] block mb-0.5 text-indigo-650">Mini Integration Target</span>
                                <p className="text-slate-600 leading-relaxed font-sans">{week.sundayReview.miniTask}</p>
                              </div>

                              {/* Reflection write */}
                              <div>
                                <span className="font-bold text-slate-700 uppercase font-mono text-[9px] block mb-0.5 text-indigo-650">LinkedIn Blog/Review Prompt</span>
                                <p className="text-slate-800 font-semibold italic">"{week.sundayReview.reflectionPrompt.title}"</p>
                                <ul className="list-disc pl-4 mt-1 space-y-0.5 text-slate-600 text-[10px]">
                                  {week.sundayReview.reflectionPrompt.requirements.map((r, i) => <li key={i}>{r}</li>)}
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Month Capstone display */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col gap-4 mt-2 mb-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 border border-indigo-200 rounded-lg shrink-0">
                <Layers className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-mono font-bold tracking-wider text-indigo-600 uppercase">End-of-month Challenge</span>
                <h4 className="text-sm font-bold text-slate-800 truncate">{activeMonthData.capstone.title}</h4>
              </div>
              <button 
                onClick={() => toggleCapstoneCompletion(activeMonthId)}
                className={`px-3 py-1 text-[10px] font-bold font-mono rounded border transition-all cursor-pointer ${
                  completedCapstones.includes(activeMonthId)
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {completedCapstones.includes(activeMonthId) ? "✓ Completed" : "Mark Done"}
              </button>
            </div>

            <div className="text-xs flex flex-col gap-3 font-sans border-t border-slate-200 pt-3">
              <div>
                <span className="font-bold text-slate-700 block mb-0.5">Architecture Overview</span>
                <p className="text-slate-650 leading-relaxed text-[11px]">{activeMonthData.capstone.architecture}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
                <div>
                  <span className="font-bold text-slate-700 block mb-1 text-[11px]">Deliverables</span>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
                    {activeMonthData.capstone.deliverables.map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
                </div>
                <div>
                  <span className="font-bold text-slate-700 block mb-1 text-[11px]">Documentation Requirements</span>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
                    {activeMonthData.capstone.docRequirements?.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: SRE Active Workspace (4 Cols on Desktop) */}
        <div className="lg:col-span-12 xl:col-span-4 lg:sticky lg:top-[85px] lg:h-[calc(100vh-120px)] flex flex-col gap-4">
          <div className="flex-1 min-h-0">
            <IncidentSimulator 
              currentWeek={expandedWeekId}
              weekTheme={activeWeekData?.theme || ""}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
