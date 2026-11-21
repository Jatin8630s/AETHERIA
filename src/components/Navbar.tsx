import React, { useState } from 'react';
import { CityAQIData } from '../types';
import { Globe2, Search, Sparkles, Wind, MapPin, Volume2, VolumeX, Shield, Compass } from 'lucide-react';

interface NavbarProps {
  cities: CityAQIData[];
  selectedCity: CityAQIData;
  onSelectCity: (city: CityAQIData) => void;
  activeSection: string;
  setActiveSection: (sec: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cities,
  selectedCity,
  onSelectCity,
  activeSection,
  setActiveSection,
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [audioEnabled, setAudioEnabled] = useState(false);

  const filteredCities = cities.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#050811]/80 border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveSection('globe')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center text-black font-extrabold shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Globe2 className="w-5 h-5 text-black animate-spin" style={{ animationDuration: '24s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tighter text-white font-mono">
                AETHERIA<span className="text-emerald-400">.AI</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                v2.5 PRO
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 block -mt-0.5">
              PLANETARY AQI TELEMETRY & ECO-ASSISTANT
            </span>
          </div>
        </div>

        {/* Navigation Tabs (Desktop) */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl glass-panel border-white/5 text-xs font-medium">
          {[
            { id: 'globe', label: '3D AQI Globe' },
            { id: 'routine', label: 'Daily Habits' },
            { id: 'iaq', label: 'Indoor IAQ Hacks' },
            { id: 'impact', label: 'Impact Matrix' },
            { id: 'ai', label: 'GenAI Assistant' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeSection === item.id
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Section: City Quick Picker & Audio Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* City Selector Dropdown button */}
          <div className="relative">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl glass-card border-white/10 hover:border-emerald-500/40 text-xs text-white transition-all cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-semibold max-w-[100px] sm:max-w-[130px] truncate">{selectedCity.name}</span>
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: selectedCity.color }}
              />
            </button>

            {/* City search popover */}
            {searchOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 max-h-96 rounded-2xl glass-panel-glow border-emerald-500/30 shadow-2xl z-50 flex flex-col overflow-hidden animate-fade-in">
                <div className="p-3 border-b border-white/10 flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search city or country..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                    autoFocus
                  />
                </div>
                <div className="flex-1 overflow-y-auto max-h-72 p-1.5 space-y-1">
                  {filteredCities.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        onSelectCity(c);
                        setSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-all cursor-pointer ${
                        selectedCity.id === c.id
                          ? 'bg-emerald-500/20 text-white font-bold'
                          : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                        <span className="truncate">{c.name}, {c.country}</span>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded ml-2 shrink-0 font-bold" style={{ color: c.color, backgroundColor: `${c.color}20` }}>
                        {c.aqi}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sound / Atmosphere Toggle */}
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
              audioEnabled
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 shadow-lg shadow-emerald-500/20'
                : 'glass-panel border-white/5 text-slate-500 hover:text-slate-300'
            }`}
            title={audioEnabled ? 'Ambient Telemetry Audio Active' : 'Enable Ambient Telemetry Audio'}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="flex md:hidden items-center gap-1 overflow-x-auto px-4 py-2 border-t border-white/5 text-[11px]">
        {[
          { id: 'globe', label: '3D Globe' },
          { id: 'routine', label: 'Routines' },
          { id: 'iaq', label: 'IAQ Hacks' },
          { id: 'impact', label: 'Impact' },
          { id: 'ai', label: 'Assistant' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              activeSection === item.id
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
