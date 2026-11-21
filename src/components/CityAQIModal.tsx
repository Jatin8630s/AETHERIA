import React from 'react';
import { CityAQIData } from '../types';
import { X, Wind, Activity, Thermometer, Droplets, ShieldCheck, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';

interface CityAQIModalProps {
  city: CityAQIData | null;
  onClose: () => void;
  onApplyToLifestyle: (city: CityAQIData) => void;
}

export const CityAQIModal: React.FC<CityAQIModalProps> = ({ city, onClose, onApplyToLifestyle }) => {
  if (!city) return null;

  const isSevere = city.aqi > 150;
  const isModerate = city.aqi > 50 && city.aqi <= 150;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl glass-panel-glow border-emerald-500/30 p-6 md:p-8 text-white shadow-2xl">
        {/* Ambient Top Glow Bar */}
        <div 
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{ backgroundColor: city.color }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full glass-panel border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Section */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: city.color }} />
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
                TELEMETRY STATION // {city.country}
              </span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white">{city.name}</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Coordinates: {city.lat.toFixed(2)}°N, {city.lng.toFixed(2)}°E • Last update: {city.updatedAt || 'Live satellite telemetry'}
            </p>
          </div>

          {/* AQI Score Badge */}
          <div className="flex flex-col items-end">
            <div 
              className="px-4 py-2 rounded-2xl flex items-center gap-3 border shadow-lg"
              style={{ 
                backgroundColor: `${city.color}15`, 
                borderColor: `${city.color}50`,
                boxShadow: `0 0 25px ${city.color}30`
              }}
            >
              <div className="text-right">
                <span className="text-[10px] uppercase font-mono tracking-wider block text-slate-400">US AQI</span>
                <span className="text-3xl font-black font-mono" style={{ color: city.color }}>{city.aqi}</span>
              </div>
              <div className="h-9 w-px bg-white/20" />
              <span className="text-sm font-semibold max-w-[90px] leading-tight" style={{ color: city.color }}>
                {city.category}
              </span>
            </div>
          </div>
        </div>

        {/* Particulate Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="glass-card p-3 rounded-2xl border border-white/5">
            <span className="text-[11px] font-mono text-slate-400 block mb-1">PM2.5 PARTICLES</span>
            <span className="text-xl font-bold font-mono text-cyan-300">{city.pm25} <span className="text-xs text-slate-400">µg/m³</span></span>
            <div className="mt-1 h-1 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-cyan-400 rounded-full" 
                style={{ width: `${Math.min(100, (city.pm25 / 75) * 100)}%` }} 
              />
            </div>
          </div>

          <div className="glass-card p-3 rounded-2xl border border-white/5">
            <span className="text-[11px] font-mono text-slate-400 block mb-1">PM10 COARSE</span>
            <span className="text-xl font-bold font-mono text-emerald-300">{city.pm10} <span className="text-xs text-slate-400">µg/m³</span></span>
            <div className="mt-1 h-1 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-emerald-400 rounded-full" 
                style={{ width: `${Math.min(100, (city.pm10 / 150) * 100)}%` }} 
              />
            </div>
          </div>

          <div className="glass-card p-3 rounded-2xl border border-white/5">
            <span className="text-[11px] font-mono text-slate-400 block mb-1">NITROGEN DIOXIDE</span>
            <span className="text-xl font-bold font-mono text-amber-300">{city.no2} <span className="text-xs text-slate-400">µg/m³</span></span>
            <div className="mt-1 h-1 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-amber-400 rounded-full" 
                style={{ width: `${Math.min(100, (city.no2 / 100) * 100)}%` }} 
              />
            </div>
          </div>

          <div className="glass-card p-3 rounded-2xl border border-white/5">
            <span className="text-[11px] font-mono text-slate-400 block mb-1">GROUND OZONE</span>
            <span className="text-xl font-bold font-mono text-purple-300">{city.o3} <span className="text-xs text-slate-400">µg/m³</span></span>
            <div className="mt-1 h-1 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-purple-400 rounded-full" 
                style={{ width: `${Math.min(100, (city.o3 / 100) * 100)}%` }} 
              />
            </div>
          </div>
        </div>

        {/* Ambient Conditions strip */}
        <div className="flex items-center justify-around py-2.5 px-4 rounded-xl bg-white/[0.03] border border-white/5 mb-6 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <Thermometer className="w-4 h-4 text-orange-400" />
            <span>Temperature: <strong>{city.temp ?? 22}°C</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Droplets className="w-4 h-4 text-cyan-400" />
            <span>Humidity: <strong>{city.humidity ?? 55}%</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wind className="w-4 h-4 text-emerald-400" />
            <span>Wind Speed: <strong>{city.windSpeed ?? 11} km/h</strong></span>
          </div>
        </div>

        {/* Health Advisory & GenAI Recommendation */}
        <div className="p-4 rounded-2xl glass-card border border-white/10 mb-6">
          <div className="flex items-start gap-3">
            {isSevere ? (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            ) : isModerate ? (
              <Activity className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="text-sm font-bold text-white mb-1">
                {isSevere 
                  ? 'Active Particulate Warning: Protective Measures Required' 
                  : isModerate 
                  ? 'Moderate Atmospheric Sensitivity Advisory' 
                  : 'Favorable Biospheric Air Conditions'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isSevere
                  ? `Fine particulates (PM2.5) are critically high in ${city.name}. Avoid intense outdoor exercise. Keep domestic windows sealed and run True-HEPA air cleaners in main living and sleeping quarters.`
                  : isModerate
                  ? `Sensitive individuals with respiratory or cardiovascular sensitivities should reduce prolonged outdoor exertion. Morning air exchange is recommended before peak midday traffic.`
                  : `Air quality is in the healthy green tier. Optimal conditions for low-emission active commuting (walking, cycling) and natural cross-ventilation.`}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button: Sync Location into GenAI */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl glass-panel border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all"
          >
            Close Overview
          </button>
          <button
            onClick={() => {
              onApplyToLifestyle(city);
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold text-xs flex items-center gap-2 hover:shadow-lg hover:shadow-emerald-500/30 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Tailor Daily Routines to {city.name}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
