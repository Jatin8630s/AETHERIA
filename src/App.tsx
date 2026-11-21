import React, { useState, useEffect } from 'react';
import { CityAQIData, UserLifestyle, RoutineTask, DirectImpactStats } from './types';
import { GLOBAL_CITIES } from './data/citiesAQI';
import { fetchLiveCityAQI, detectUserLocationAQI } from './services/aqiService';
import { generateDailyRoutineWithAI, calculateDirectImpact } from './services/genAiService';
import { Navbar } from './components/Navbar';
import { AQIGlobe } from './components/AQIGlobe';
import { CityAQIModal } from './components/CityAQIModal';
import { DailyRoutinePlanner } from './components/DailyRoutinePlanner';
import { IAQHacksPanel } from './components/IAQHacksPanel';
import { ImpactDashboard } from './components/ImpactDashboard';
import { AIAssistantChat } from './components/AIAssistantChat';
import { Sparkles, Globe, ShieldCheck, Wind, AlertCircle, ArrowUpRight, Compass, Activity, CheckCircle2 } from 'lucide-react';

export function App() {
  const [cities, setCities] = useState<CityAQIData[]>(GLOBAL_CITIES);
  const [selectedCity, setSelectedCity] = useState<CityAQIData>(GLOBAL_CITIES[0]); // New Delhi default
  const [modalCity, setModalCity] = useState<CityAQIData | null>(null);
  const [activeSection, setActiveSection] = useState<string>('globe');

  const [lifestyle, setLifestyle] = useState<UserLifestyle>({
    city: 'New Delhi',
    dwellingType: 'apartment',
    commuteMode: 'public_transit',
    commuteDistanceKm: 12,
    hasAirPurifier: true,
    dietPreference: 'flexitarian',
    hvacType: 'natural_ventilation',
  });

  const [tasks, setTasks] = useState<RoutineTask[]>([]);
  const [isRoutineLoading, setIsRoutineLoading] = useState<boolean>(false);
  const [impactStats, setImpactStats] = useState<DirectImpactStats>({
    totalCo2AvoidedKg: 0,
    totalPm25AvoidedUg: 0,
    carKmEquivalent: 0,
    treesPlantedEquivalent: 0,
    cleanAirHoursGained: 0,
  });

  // On mount: Try detecting user location and fetching live telemetry
  useEffect(() => {
    async function initTelemetry() {
      // 1. Detect user local city or keep default
      const detected = await detectUserLocationAQI();
      setSelectedCity(detected);
      setLifestyle(prev => ({ ...prev, city: detected.name }));

      // 2. Fetch live telemetry for selected city
      const live = await fetchLiveCityAQI(detected.lat, detected.lng, detected);
      setSelectedCity(live);

      // 3. Generate initial AI routine
      setIsRoutineLoading(true);
      const initialTasks = await generateDailyRoutineWithAI({
        cityData: live,
        lifestyle: { ...lifestyle, city: live.name },
      });
      setTasks(initialTasks);
      setIsRoutineLoading(false);
    }

    initTelemetry();
  }, []);

  // Recalculate impact stats whenever tasks change
  useEffect(() => {
    const completedCount = tasks.filter(t => t.completed).length;
    const newStats = calculateDirectImpact(completedCount, lifestyle);
    setImpactStats(newStats);
  }, [tasks, lifestyle]);

  // When selectedCity changes, refresh live telemetry for that city
  const handleSelectCity = async (city: CityAQIData) => {
    setSelectedCity(city);
    setLifestyle(prev => ({ ...prev, city: city.name }));

    // Fetch live atmospheric telemetry
    const liveCity = await fetchLiveCityAQI(city.lat, city.lng, city);
    setSelectedCity(liveCity);

    // Update cities state if updated
    setCities(prev => prev.map(c => c.id === liveCity.id ? liveCity : c));

    // Refresh daily routine for this new city context
    setIsRoutineLoading(true);
    const updatedTasks = await generateDailyRoutineWithAI({
      cityData: liveCity,
      lifestyle: { ...lifestyle, city: liveCity.name },
    });
    setTasks(updatedTasks);
    setIsRoutineLoading(false);
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const handleRegenerateRoutine = async () => {
    setIsRoutineLoading(true);
    const refreshed = await generateDailyRoutineWithAI({
      cityData: selectedCity,
      lifestyle,
    });
    setTasks(refreshed);
    setIsRoutineLoading(false);
  };

  const handleUpdateLifestyle = (updates: Partial<UserLifestyle>) => {
    setLifestyle(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Navbar */}
      <Navbar
        cities={cities}
        selectedCity={selectedCity}
        onSelectCity={handleSelectCity}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Section 1: Hero & Interactive 3D Globe */}
        <section id="globe" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border-emerald-500/30 text-xs font-mono text-emerald-400 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>GENAI BIOSURVEILLANCE & DECARBONIZATION ENGINE</span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                Planetary Intelligence.<br />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  Zero-Emission Living.
                </span>
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
              Explore the holographic 3D globe to inspect real-time atmospheric particulate densities. Let our GenAI assistant synthesize your personalized daily low-pollution routine and indoor air quality shields.
            </p>
          </div>

          {/* 3D Globe & Live Station Telemetry Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* 3D WebGL Globe (8 cols on large) */}
            <div className="lg:col-span-8 flex flex-col">
              <AQIGlobe
                cities={cities}
                selectedCity={selectedCity}
                onSelectCity={(city) => {
                  handleSelectCity(city);
                  setModalCity(city);
                }}
              />
            </div>

            {/* Live Station Telemetry Card (4 cols on large) */}
            <div className="lg:col-span-4 flex flex-col justify-between glass-panel-glow rounded-3xl p-6 border-emerald-500/20 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    LIVE TELEMETRY STATION
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    ID: {selectedCity.id.toUpperCase()}
                  </span>
                </div>

                <div className="mb-6">
                  <h3 className="text-2xl font-black text-white">{selectedCity.name}</h3>
                  <span className="text-xs text-slate-400">{selectedCity.country}</span>

                  <div className="mt-4 p-4 rounded-2xl glass-card border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">US AIR QUALITY INDEX</span>
                      <span className="text-4xl font-black font-mono" style={{ color: selectedCity.color }}>
                        {selectedCity.aqi}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="px-2.5 py-1 rounded-xl text-xs font-bold block" style={{ color: selectedCity.color, backgroundColor: `${selectedCity.color}20` }}>
                        {selectedCity.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 mt-1 block">
                        Dominant: <strong>{selectedCity.dominantPollutant}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Key Particulate Metrics */}
                <div className="space-y-2.5 mb-6 text-xs">
                  <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-slate-400">PM2.5 Micro-Particles</span>
                    <span className="font-mono font-bold text-cyan-300">{selectedCity.pm25} µg/m³</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-slate-400">PM10 Inhalable Coarse</span>
                    <span className="font-mono font-bold text-emerald-300">{selectedCity.pm10} µg/m³</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-slate-400">Ambient Temperature</span>
                    <span className="font-mono font-bold text-white">{selectedCity.temp ?? 22}°C</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => setModalCity(selectedCity)}
                  className="w-full py-3 rounded-2xl glass-panel border-white/10 hover:border-emerald-500/40 text-xs font-bold text-slate-200 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>Inspect Full Telemetry & Breakdown</span>
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById('routine');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-extrabold text-xs hover:shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Low-Emission Day Plan</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Daily Routine Planner */}
        <section id="routine" className="pt-6">
          <DailyRoutinePlanner
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onRegenerateRoutine={handleRegenerateRoutine}
            isLoading={isRoutineLoading}
            cityData={selectedCity}
            lifestyle={lifestyle}
            onUpdateLifestyle={handleUpdateLifestyle}
          />
        </section>

        {/* Section 3: Indoor Air Quality (IAQ) Hacks */}
        <section id="iaq" className="pt-6">
          <IAQHacksPanel cityData={selectedCity} />
        </section>

        {/* Section 4: Tangible Impact Matrix & Simulator */}
        <section id="impact" className="pt-6">
          <ImpactDashboard stats={impactStats} lifestyle={lifestyle} />
        </section>

        {/* Section 5: GenAI Eco-Concierge Chat */}
        <section id="ai" className="pt-6">
          <AIAssistantChat
            cityData={selectedCity}
            lifestyle={lifestyle}
            tasks={tasks}
          />
        </section>
      </main>

      {/* City Detail Modal */}
      <CityAQIModal
        city={modalCity}
        onClose={() => setModalCity(null)}
        onApplyToLifestyle={handleSelectCity}
      />

      {/* Footer */}
      <footer className="mt-20 border-t border-white/5 bg-[#03060c] py-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              🌍
            </div>
            <div>
              <p className="font-bold text-slate-300">AETHERIA.AI // Planetary Atmospheric Intelligence</p>
              <p className="text-[11px] text-slate-500">Open-Meteo Air Quality API • NASA Clean Air Biological Protocols • IPCC AR6 Carbon Multipliers</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              GLOBAL RADAR RUNNING
            </span>
            <span>Zero-Emission Certified</span>
            <span>All Habit Choices Tracked Locally</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
