import React, { useState } from 'react';
import { RoutineTask, CityAQIData, UserLifestyle } from '../types';
import { CheckCircle2, Circle, Sparkles, RefreshCw, Bike, Car, Home, Salad, Zap, Wind, ShieldAlert, Award, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DailyRoutinePlannerProps {
  tasks: RoutineTask[];
  onToggleTask: (taskId: string) => void;
  onRegenerateRoutine: () => void;
  isLoading: boolean;
  cityData: CityAQIData;
  lifestyle: UserLifestyle;
  onUpdateLifestyle: (lifestyle: Partial<UserLifestyle>) => void;
}

export const DailyRoutinePlanner: React.FC<DailyRoutinePlannerProps> = ({
  tasks,
  onToggleTask,
  onRegenerateRoutine,
  isLoading,
  cityData,
  lifestyle,
  onUpdateLifestyle,
}) => {
  const [filterPeriod, setFilterPeriod] = useState<string>('all');

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const totalCo2Saved = tasks
    .filter(t => t.completed)
    .reduce((acc, t) => acc + t.co2SavedKg, 0)
    .toFixed(1);

  const totalPm25Avoided = tasks
    .filter(t => t.completed)
    .reduce((acc, t) => acc + t.pm25AvoidedUg, 0);

  const handleTaskClick = (task: RoutineTask) => {
    if (!task.completed) {
      // Fire subtle celebratory eco confetti
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10B981', '#06B6D4', '#FBBF24', '#34D399']
      });
    }
    onToggleTask(task.id);
  };

  const filteredTasks = filterPeriod === 'all' 
    ? tasks 
    : tasks.filter(t => t.period === filterPeriod);

  const getCategoryIcon = (category: RoutineTask['category']) => {
    switch (category) {
      case 'commute': return <Bike className="w-4 h-4 text-emerald-400" />;
      case 'energy': return <Zap className="w-4 h-4 text-amber-400" />;
      case 'ventilation': return <Wind className="w-4 h-4 text-cyan-400" />;
      case 'diet': return <Salad className="w-4 h-4 text-emerald-300" />;
      case 'wellness': return <Award className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="w-full glass-panel-glow rounded-3xl p-6 md:p-8 border-emerald-500/20 shadow-2xl relative overflow-hidden">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
              AI-CURATED ROUTINE // SYNCED TO {cityData.name.toUpperCase()} (AQI {cityData.aqi})
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Low-Emission Daily Habit Protocol
          </h2>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-xl">
            Real-time habits structured around today's local pollution patterns to maximize personal respiratory defense and slash household emissions.
          </p>
        </div>

        {/* Regenerate Button */}
        <button
          onClick={onRegenerateRoutine}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl glass-panel border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 hover:text-white transition-all text-xs font-bold cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Synthesizing with AI...' : 'Regenerate for Today'}</span>
        </button>
      </div>

      {/* Lifestyle Customizer Ribbon */}
      <div className="p-4 rounded-2xl glass-card border border-white/5 mb-8">
        <span className="text-[11px] font-mono uppercase text-slate-400 block mb-3">
          PERSONAL LIFESTYLE CONTEXT (AFFECTS PROMPT & METRICS):
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* Commute Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-cyan-400" /> Commute Mode
            </label>
            <select
              value={lifestyle.commuteMode}
              onChange={(e) => onUpdateLifestyle({ commuteMode: e.target.value as any })}
              className="bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-400"
            >
              <option value="gas_car">Gasoline Car (180g CO₂/km)</option>
              <option value="ev">Electric Vehicle (45g CO₂/km)</option>
              <option value="public_transit">Public Metro/Rail (30g CO₂/km)</option>
              <option value="bicycle_walk">Bicycle & Walking (0g CO₂/km)</option>
              <option value="remote_work">100% Remote / Home Office</option>
            </select>
          </div>

          {/* Dwelling Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-emerald-400" /> Dwelling Type
            </label>
            <select
              value={lifestyle.dwellingType}
              onChange={(e) => onUpdateLifestyle({ dwellingType: e.target.value as any })}
              className="bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-400"
            >
              <option value="apartment">Urban Apartment / Highrise</option>
              <option value="suburban_house">Suburban Detached House</option>
              <option value="dense_urban_studio">Compact City Studio</option>
              <option value="rural_home">Rural / Low-Density Dwelling</option>
            </select>
          </div>

          {/* Diet Preference */}
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 flex items-center gap-1.5">
              <Salad className="w-3.5 h-3.5 text-amber-400" /> Diet Focus
            </label>
            <select
              value={lifestyle.dietPreference}
              onChange={(e) => onUpdateLifestyle({ dietPreference: e.target.value as any })}
              className="bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-400"
            >
              <option value="plant_based">100% Plant-Based (Lowest CO₂)</option>
              <option value="vegetarian">Vegetarian (Low CO₂)</option>
              <option value="flexitarian">Flexitarian (Balanced)</option>
              <option value="omnivore">Standard Omnivore</option>
            </select>
          </div>
        </div>
      </div>

      {/* Progress & Live Daily Score Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-4 rounded-2xl glass-card border-white/5 flex items-center gap-4">
          <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-400 transition-all duration-700 ease-out"
                strokeDasharray={`${progressPercent}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-mono font-bold text-white">{progressPercent}%</span>
          </div>
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase">PROTOCOL STATUS</span>
            <p className="text-sm font-bold text-white">{completedCount} of {tasks.length} Completed</p>
            <span className="text-[10px] text-emerald-400">Keep going to complete today's goal!</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card border-white/5 flex flex-col justify-center">
          <span className="text-[11px] font-mono text-slate-400 uppercase">AVOIDED CARBON TODAY</span>
          <p className="text-2xl font-black font-mono text-emerald-400">
            {totalCo2Saved} <span className="text-xs font-normal text-slate-400">kg CO₂e</span>
          </p>
          <span className="text-[10px] text-slate-400">Direct emission reduction achieved</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border-white/5 flex flex-col justify-center">
          <span className="text-[11px] font-mono text-slate-400 uppercase">RESPIRATORY PM2.5 SHIELDED</span>
          <p className="text-2xl font-black font-mono text-cyan-400">
            {totalPm25Avoided} <span className="text-xs font-normal text-slate-400">µg particulates</span>
          </p>
          <span className="text-[10px] text-slate-400">Kept out of your alveolar bloodstream</span>
        </div>
      </div>

      {/* Period Filter Tabs */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
        {['all', 'morning', 'midday', 'afternoon', 'evening', 'night'].map((period) => (
          <button
            key={period}
            onClick={() => setFilterPeriod(period)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium capitalize transition-all cursor-pointer whitespace-nowrap ${
              filterPeriod === period
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'glass-panel border-white/5 text-slate-400 hover:text-white'
            }`}
          >
            {period}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            onClick={() => handleTaskClick(task)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              task.completed
                ? 'bg-emerald-950/20 border-emerald-500/30 opacity-75'
                : 'glass-card border-white/5 hover:border-emerald-400/40 hover:bg-slate-900/60'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <button 
                className="mt-1 text-slate-400 hover:text-emerald-400 transition-colors shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTaskClick(task);
                }}
              >
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-500 hover:text-emerald-400" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded-md border border-cyan-500/20">
                      <Clock className="w-3 h-3" /> {task.timeSlot}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded-md">
                      {getCategoryIcon(task.category)}
                      <span className="capitalize">{task.category}</span>
                    </span>
                  </div>

                  {/* Impact pill */}
                  <div className="flex items-center gap-2 text-[11px] font-mono">
                    <span className="text-emerald-400 font-bold">-{task.co2SavedKg}kg CO₂</span>
                    <span className="text-slate-500">|</span>
                    <span className="text-cyan-400 font-bold">-{task.pm25AvoidedUg}µg PM2.5</span>
                  </div>
                </div>

                <h4 className={`text-sm md:text-base font-bold tracking-tight ${task.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                  {task.title}
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {task.description}
                </p>

                {/* GenAI Insight Callout */}
                <div className="mt-2 text-[11px] text-emerald-300/90 font-mono bg-emerald-500/10 px-2.5 py-1.5 rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{task.aiTip}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
