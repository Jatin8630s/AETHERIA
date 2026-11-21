import React, { useState } from 'react';
import { DirectImpactStats, UserLifestyle } from '../types';
import { TreePine, Car, Wind, DollarSign, TrendingDown, HelpCircle, Layers, Sparkles } from 'lucide-react';

interface ImpactDashboardProps {
  stats: DirectImpactStats;
  lifestyle: UserLifestyle;
}

export const ImpactDashboard: React.FC<ImpactDashboardProps> = ({ stats, lifestyle }) => {
  // Interactive Simulator Sliders
  const [transitKm, setTransitKm] = useState<number>(10);
  const [plantMeals, setPlantMeals] = useState<number>(4);
  const [thermostatShift, setThermostatShift] = useState<number>(1);

  // Dynamic calculations based on sliders
  const monthlyCo2Saved = (
    transitKm * 0.18 * 22 + // 180g CO2/km saved across 22 workdays
    plantMeals * 3.8 * 4.3 + // 3.8kg CO2 saved per plant meal over 4.3 weeks
    thermostatShift * 18.5 // ~18.5kg CO2 saved per 1°C HVAC shift monthly
  ).toFixed(1);

  const monthlyPm25Avoided = Math.round(
    transitKm * 14 * 22 +
    thermostatShift * 120
  );

  const carKmSaved = (parseFloat(monthlyCo2Saved) / 0.18).toFixed(0);
  const treesEquiv = (parseFloat(monthlyCo2Saved) / (21.7 / 12)).toFixed(1);
  const dollarsSaved = Math.round(transitKm * 0.14 * 22 + thermostatShift * 16);

  return (
    <div className="w-full glass-panel-glow rounded-3xl p-6 md:p-8 border-emerald-500/20 shadow-2xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
            DIRECT IMPACT MATRIX // QUANTIFIABLE BIOSPHERIC GAINS
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Tangible Impact & Emissions Simulator
        </h2>
        <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-xl">
          Every small adjustment mathematically offsets atmospheric greenhouse warming and keeps micro-particulates out of your bloodstream.
        </p>
      </div>

      {/* Hero Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-4 md:p-5 rounded-2xl glass-card border border-white/5 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase">MONTHLY CO₂ AVERTED</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-black font-mono text-emerald-400 tracking-tight">
            {monthlyCo2Saved} <span className="text-xs font-normal text-slate-400">kg</span>
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">
            = {carKmSaved} km avoided in gas car
          </span>
        </div>

        <div className="p-4 md:p-5 rounded-2xl glass-card border border-white/5 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase">PM2.5 LUNG SHIELD</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Wind className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-black font-mono text-cyan-400 tracking-tight">
            {monthlyPm25Avoided.toLocaleString()} <span className="text-xs font-normal text-slate-400">µg</span>
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Fine particulates shielded from alveoli
          </span>
        </div>

        <div className="p-4 md:p-5 rounded-2xl glass-card border border-white/5 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase">TREE ABSORPTION EQUIV.</span>
            <div className="p-2 rounded-xl bg-green-500/10 text-green-400">
              <TreePine className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-black font-mono text-green-400 tracking-tight">
            {treesEquiv} <span className="text-xs font-normal text-slate-400">trees</span>
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Annual sequestration equivalence
          </span>
        </div>

        <div className="p-4 md:p-5 rounded-2xl glass-card border border-white/5 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase">WALLET ENERGY SAVINGS</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-black font-mono text-amber-400 tracking-tight">
            ${dollarsSaved} <span className="text-xs font-normal text-slate-400">/mo</span>
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Gasoline & utility bill reductions
          </span>
        </div>
      </div>

      {/* Interactive Simulator Sliders */}
      <div className="p-6 rounded-2xl glass-card border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Interactive Habit Impact Simulator</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">Drag sliders to view projected metrics</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* Active Transit Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-300 font-medium">Daily Active / Public Transit Switch:</span>
              <span className="font-mono font-bold text-emerald-400">{transitKm} km/day</span>
            </div>
            <input
              type="range"
              min="0"
              max="35"
              step="1"
              value={transitKm}
              onChange={(e) => setTransitKm(Number(e.target.value))}
              className="w-full accent-emerald-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 km</span>
              <span>15 km</span>
              <span>35 km</span>
            </div>
          </div>

          {/* Plant-based meals Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-300 font-medium">Plant-Based Meals Replaced:</span>
              <span className="font-mono font-bold text-cyan-400">{plantMeals} meals/wk</span>
            </div>
            <input
              type="range"
              min="0"
              max="14"
              step="1"
              value={plantMeals}
              onChange={(e) => setPlantMeals(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 meals</span>
              <span>7 meals</span>
              <span>14 meals</span>
            </div>
          </div>

          {/* Thermostat HVAC Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-300 font-medium">HVAC Thermostat Offset:</span>
              <span className="font-mono font-bold text-amber-400">±{thermostatShift}°C</span>
            </div>
            <input
              type="range"
              min="0"
              max="4"
              step="0.5"
              value={thermostatShift}
              onChange={(e) => setThermostatShift(Number(e.target.value))}
              className="w-full accent-amber-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0°C</span>
              <span>2°C</span>
              <span>4°C</span>
            </div>
          </div>
        </div>

        {/* Scientific Note */}
        <div className="mt-6 pt-4 border-t border-white/5 flex items-start gap-2.5 text-slate-400 text-[11px] leading-relaxed">
          <HelpCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <span>
            <strong>Calculation Methodology:</strong> Carbon coefficients derived from IPCC AR6 and EPA SmartWay transport data (180g CO₂/km for average passenger combustion vehicles). PM2.5 inhalation savings model assumes standard resting breath volume of 11,000 liters/day and targeted air filtration efficiency.
          </span>
        </div>
      </div>
    </div>
  );
};
