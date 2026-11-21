import React, { useState } from 'react';
import { IAQHack, CityAQIData } from '../types';
import { CURATED_IAQ_HACKS } from '../services/genAiService';
import { ShieldCheck, Wind, AlertCircle, Sparkles, Filter, ChevronRight, CheckCircle, Home, Flame, Bed, Briefcase } from 'lucide-react';

interface IAQHacksPanelProps {
  cityData: CityAQIData;
}

export const IAQHacksPanel: React.FC<IAQHacksPanelProps> = ({ cityData }) => {
  const [selectedRoom, setSelectedRoom] = useState<string>('all');
  const [expandedHackId, setExpandedHackId] = useState<string | null>('iaq-1');
  const [completedHacks, setCompletedHacks] = useState<Set<string>>(new Set());

  const toggleComplete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(completedHacks);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCompletedHacks(next);
  };

  const isSevereOutdoor = cityData.aqi > 150;
  const isModerateOutdoor = cityData.aqi > 50 && cityData.aqi <= 150;

  const filteredHacks = selectedRoom === 'all'
    ? CURATED_IAQ_HACKS
    : CURATED_IAQ_HACKS.filter(h => h.room === selectedRoom);

  const getRoomIcon = (room: IAQHack['room']) => {
    switch (room) {
      case 'kitchen': return <Flame className="w-3.5 h-3.5 text-amber-400" />;
      case 'bedroom': return <Bed className="w-3.5 h-3.5 text-indigo-400" />;
      case 'home_office': return <Briefcase className="w-3.5 h-3.5 text-cyan-400" />;
      case 'living_room': return <Home className="w-3.5 h-3.5 text-emerald-400" />;
      default: return <Wind className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  return (
    <div className="w-full glass-panel-glow rounded-3xl p-6 md:p-8 border-cyan-500/20 shadow-2xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
              MICROCLIMATE SANCTUARY // INDOOR AIR QUALITY (IAQ)
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Indoor Air Quality Hacks & Bio-Defense
          </h2>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-xl">
            Humans spend 90% of their lives indoors. Scientifically engineered domestic modifications to cut indoor pollutants, VOCs, and microparticulates.
          </p>
        </div>

        {/* Real-Time Ventilation Advisory Banner */}
        <div className="p-3.5 rounded-2xl glass-card border border-white/10 flex items-center gap-3">
          <div className={`p-2 rounded-xl ${isSevereOutdoor ? 'bg-rose-500/20 text-rose-400' : isModerateOutdoor ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block">NATURAL VENTILATION STATUS</span>
            <span className="text-xs font-bold text-white block">
              {isSevereOutdoor 
                ? '🔴 SEAL WINDOWS: High Particulate Infiltration Risk' 
                : isModerateOutdoor 
                ? '🟡 SELECTIVE FLUSH: Limit opening to 15 mins off-peak' 
                : '🟢 SAFE TO VENTILATE: Ambient air clean (<50 AQI)'}
            </span>
          </div>
        </div>
      </div>

      {/* Room Category Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Rooms' },
          { id: 'living_room', label: 'Living Room' },
          { id: 'kitchen', label: 'Kitchen (Combustion Zone)' },
          { id: 'bedroom', label: 'Bedroom (Sleep IAQ)' },
          { id: 'home_office', label: 'Home Office (VOCs)' },
          { id: 'whole_home', label: 'Whole Dwelling' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedRoom(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              selectedRoom === tab.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'glass-panel border-white/5 text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Hacks List */}
      <div className="space-y-3.5">
        {filteredHacks.map((hack) => {
          const isExpanded = expandedHackId === hack.id;
          const isDone = completedHacks.has(hack.id);

          return (
            <div
              key={hack.id}
              className={`rounded-2xl border transition-all ${
                isExpanded 
                  ? 'bg-slate-900/80 border-cyan-500/40 shadow-lg shadow-cyan-950/30' 
                  : 'glass-card border-white/5 hover:border-white/20'
              }`}
            >
              {/* Header row */}
              <div
                onClick={() => setExpandedHackId(isExpanded ? null : hack.id)}
                className="p-4 flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={(e) => toggleComplete(hack.id, e)}
                    className="text-slate-500 hover:text-cyan-400 transition-colors shrink-0"
                  >
                    {isDone ? (
                      <CheckCircle className="w-5 h-5 text-cyan-400 fill-cyan-400/20" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-slate-600 hover:border-cyan-400" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="flex items-center gap-1 text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                        {getRoomIcon(hack.room)}
                        <span className="uppercase">{hack.room.replace('_', ' ')}</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-white/5">
                        {hack.difficulty}
                      </span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        hack.impactLevel === 'Critical' ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {hack.impactLevel} Impact
                      </span>
                    </div>
                    <h4 className={`text-sm md:text-base font-bold truncate ${isDone ? 'line-through text-slate-500' : 'text-white'}`}>
                      {hack.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-90 text-cyan-400' : ''}`} />
                </div>
              </div>

              {/* Collapsible Details */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-1 border-t border-white/5 animate-fade-in text-xs">
                  <p className="text-slate-300 leading-relaxed mb-3">
                    {hack.summary}
                  </p>

                  {/* Action Steps */}
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 mb-3">
                    <span className="text-[10px] font-mono uppercase text-cyan-400 block mb-2 font-bold tracking-wider">
                      EXECUTION STEPS:
                    </span>
                    <ul className="space-y-1.5 text-slate-300">
                      {hack.actionSteps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Scientific Mechanism */}
                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-300/90 font-mono text-[11px] flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-emerald-300 block mb-0.5">Physical & Biological Mechanism:</strong>
                      <span>{hack.scientificReason}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
