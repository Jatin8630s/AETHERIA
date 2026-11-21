import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, CityAQIData, UserLifestyle, RoutineTask } from '../types';
import { queryAetheriaAI } from '../services/genAiService';
import { Send, Bot, User, Sparkles, Key, Check, ArrowRight, CornerDownLeft, ShieldAlert } from 'lucide-react';

interface AIAssistantChatProps {
  cityData: CityAQIData;
  lifestyle: UserLifestyle;
  tasks: RoutineTask[];
}

export const AIAssistantChat: React.FC<AIAssistantChatProps> = ({ cityData, lifestyle, tasks }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: `Hello! I am **AetherAI**, your personal GenAI Environmental Intelligence & Low-Pollution Strategist.
      
Currently monitoring **${cityData.name}** at **${cityData.aqi} US AQI** (${cityData.category}). How can I help you optimize your daily emissions, upgrade your indoor breathing zone, or calculate the direct impact of your lifestyle choices today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      metricsBadge: {
        label: 'Realtime Air Telemetry',
        value: `${cityData.aqi} AQI in ${cityData.name}`,
        type: cityData.aqi > 100 ? 'warning' : 'positive'
      },
      suggestedActions: [
        'How should I commute given today\'s AQI?',
        'Give me 3 hacks to purify indoor air without buying expensive equipment',
        'How much CO2 can I save by switching my diet today?'
      ]
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [showKeyInput, setShowKeyInput] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      const response = await queryAetheriaAI(
        query,
        { cityData, lifestyle, recentTasks: tasks },
        apiKey
      );

      const assistantMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        metricsBadge: response.metricsBadge,
        suggestedActions: response.suggestedFollowUps
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: 'I encountered an issue synthesizing telemetry. Please try again or rephrase your question.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full glass-panel-glow rounded-3xl p-6 md:p-8 border-cyan-500/20 shadow-2xl relative overflow-hidden flex flex-col h-[650px]">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-black font-bold shadow-lg shadow-cyan-500/20">
            <Bot className="w-5 h-5 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">AetherAI Eco-Concierge</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              GenAI Reasoning Engine • Synced to {cityData.name} ({cityData.aqi} AQI)
            </p>
          </div>
        </div>

        {/* Gemini API Key Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel border-white/10 text-[11px] font-mono text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>{apiKey ? 'API Key Active' : 'Custom API Key'}</span>
          </button>

          {showKeyInput && (
            <div className="absolute right-0 top-full mt-2 w-72 p-3 rounded-2xl glass-panel-glow border-amber-400/30 z-30 shadow-2xl">
              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                GOOGLE GEMINI API KEY (OPTIONAL):
              </label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono mb-2"
              />
              <p className="text-[10px] text-slate-400 leading-tight">
                Leave empty to use built-in calibrated environmental intelligence.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-[85%] md:max-w-[78%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`p-4 rounded-2xl text-xs md:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-tr-sm shadow-md'
                    : 'glass-card border border-white/5 text-slate-200 rounded-tl-sm shadow-lg'
                }`}
              >
                {/* Parse Markdown-like structure */}
                <div className="space-y-2 whitespace-pre-wrap">
                  {msg.text}
                </div>

                {/* Metrics badge if present */}
                {msg.metricsBadge && (
                  <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase text-slate-400">
                      {msg.metricsBadge.label}:
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                      msg.metricsBadge.type === 'positive' 
                        ? 'bg-emerald-500/20 text-emerald-300' 
                        : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {msg.metricsBadge.value}
                    </span>
                  </div>
                )}
              </div>

              {/* Timestamp */}
              <span className={`text-[10px] text-slate-500 font-mono mt-1 block px-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.timestamp}
              </span>

              {/* Suggested Follow-ups */}
              {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {msg.suggestedActions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(action)}
                      className="text-[11px] px-2.5 py-1 rounded-lg glass-panel border-white/5 text-slate-300 hover:text-emerald-300 hover:border-emerald-500/30 transition-all text-left flex items-center gap-1 cursor-pointer"
                    >
                      <span>{action}</span>
                      <ArrowRight className="w-2.5 h-2.5 shrink-0 opacity-60" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 items-start">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-1">
              <Bot className="w-4 h-4" />
            </div>
            <div className="glass-card p-3 rounded-2xl border border-white/5 flex items-center gap-2 text-xs text-slate-400 font-mono">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
              <span>Synthesizing environmental prompt flow...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 shrink-0"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Ask AetherAI about low-emission routines, IAQ hacks, or direct impact...`}
            className="w-full bg-slate-900/90 border border-white/10 rounded-2xl px-4 py-3 text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all font-sans"
          />
        </div>

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
