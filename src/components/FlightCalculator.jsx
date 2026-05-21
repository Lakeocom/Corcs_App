import React, { useState, useEffect } from 'react';
import { Battery, Info, AlertTriangle, ShieldCheck, Clock, Zap } from 'lucide-react';

export default function FlightCalculator() {
  // Inputs
  const [batteryCapacity, setBatteryCapacity] = useState(2200); // mAh
  const [averageCurrent, setAverageCurrent] = useState(25); // Amps
  const [safetyReserve, setSafetyReserve] = useState(20); // % safety reserve (typically 20%)

  // Outputs
  const [usableCapacityAh, setUsableCapacityAh] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [flightMinutes, setFlightMinutes] = useState(0);
  const [flightSeconds, setFlightSeconds] = useState(0);
  const [safetyStatus, setSafetyStatus] = useState({ level: 'green', text: '', color: '' });

  // Common battery capacities for quick select
  const commonCapacities = [850, 1300, 1500, 1800, 2200, 3300, 4500, 5000];

  // Perform Calculations
  useEffect(() => {
    // 1. Usable Capacity (Ah)
    // Usable = Capacity (mAh) * (100 - Reserve) / (100 * 1000)
    const capAh = (batteryCapacity * (100 - safetyReserve)) / 100000;
    setUsableCapacityAh(capAh);

    // 2. Flight time in seconds
    // Time (seconds) = (Usable Ah / Current A) * 3600
    const calculatedSeconds = (capAh / averageCurrent) * 3600;
    setTotalSeconds(calculatedSeconds);

    const minutes = Math.floor(calculatedSeconds / 60);
    const seconds = Math.floor(calculatedSeconds % 60);
    
    setFlightMinutes(minutes);
    setFlightSeconds(seconds);

    // 3. Define safety alerts based on flight duration
    if (calculatedSeconds < 180) {
      // Less than 3 minutes
      setSafetyStatus({
        level: 'danger',
        text: 'Danger! Flight time is critically short (less than 3 minutes). High risk of damaging the LiPo due to over-discharge or losing the model. Consider increasing the battery mAh or reducing the propeller size to lower consumption.',
        color: 'bg-red-50 text-red-700 border-red-200'
      });
    } else if (calculatedSeconds >= 180 && calculatedSeconds < 300) {
      // Between 3 and 5 minutes
      setSafetyStatus({
        level: 'warning',
        text: 'Caution: Tight flight time (3 to 5 minutes). Ideal for fast sport flight, but you must manage your throttle stick. Set a timer with an alarm on your transmitter.',
        color: 'bg-amber-50 text-amber-700 border-amber-200'
      });
    } else {
      // 5 minutes or more
      setSafetyStatus({
        level: 'safe',
        text: 'Safe: Optimal and healthy autonomy (greater than 5 minutes). Your setup is balanced and safe for stable flights, training, or scale models.',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
      });
    }

  }, [batteryCapacity, averageCurrent, safetyReserve]);

  // Formatter for visual clock text
  const formatTimeText = () => {
    const minsStr = flightMinutes.toString().padStart(2, '0');
    const secsStr = flightSeconds.toString().padStart(2, '0');
    return `${minsStr}:${secsStr}`;
  };

  // Battery indicator color mapping based on reserve percentage
  const getBatteryColor = () => {
    if (safetyStatus.level === 'danger') return 'bg-red-500';
    if (safetyStatus.level === 'warning') return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl p-5 border border-emerald-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-emerald-700 font-bold">
            <Clock className="h-5 w-5 animate-pulse" />
            <h3 className="text-base font-extrabold text-emerald-950">Flight Autonomy Calculation</h3>
          </div>
          <p className="text-sm text-slate-600 font-light leading-relaxed">
            Lithium polymer (LiPo) batteries deteriorate if discharged completely. To protect them, aeromodellers apply the **80% rule** (leaving a 20% safety reserve upon landing).
          </p>
        </div>
        <div className="shrink-0 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] text-slate-400 font-bold block tracking-wider uppercase">TIME FORMULA</span>
          <span className="text-sm font-extrabold text-aero-navy font-mono">Minutes = (Usable Capacity Ah / Amps) x 60</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* INPUT PANEL COLUMN */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
            <Battery className="h-5 w-5 text-emerald-500" />
            <span>Power Specifications</span>
          </h3>

          {/* CAPACIDAD DE LA BATERÍA (mAh) */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-700">Battery Capacity (mAh)</label>
              <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-aero-navy text-sm font-extrabold font-mono rounded-lg">
                {batteryCapacity} mAh
              </span>
            </div>

            {/* Quick Presets */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {commonCapacities.map((cap) => (
                <button
                  key={cap}
                  type="button"
                  onClick={() => setBatteryCapacity(cap)}
                  className={`py-1.5 px-0.5 text-xs font-bold font-mono rounded-lg border transition-all ${
                    batteryCapacity === cap
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm scale-105'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cap}
                </button>
              ))}
            </div>

            <input
              type="range"
              min="300"
              max="12000"
              step="50"
              value={batteryCapacity}
              onChange={(e) => setBatteryCapacity(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[9px] text-slate-400 font-bold font-mono px-1">
              <span>300 mAh (Micro)</span>
              <span>5000 mAh (Standard 6S)</span>
              <span>12000 mAh (Giant Autonomy)</span>
            </div>
          </div>

          {/* CONSUMO PROMEDIO (Amperios) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-700">Average Motor Current (Amperes)</label>
              <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-aero-navy text-sm font-extrabold font-mono rounded-lg">
                {averageCurrent} Amps (A)
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="150"
              step="1"
              value={averageCurrent}
              onChange={(e) => setAverageCurrent(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[9px] text-slate-400 font-bold font-mono px-1">
              <span>2 A (Mini motors)</span>
              <span>60 A (Standard aerobatics)</span>
              <span>150 A (Jets / Large models)</span>
            </div>
          </div>

          {/* MARGEN DE RESERVA / SEGURIDAD (%) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-700">Safety Percentage (LiPo Reserve)</label>
              <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-extrabold font-mono rounded-lg">
                {safetyReserve}% reserve
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="40"
              step="5"
              value={safetyReserve}
              onChange={(e) => setSafetyReserve(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[9px] text-slate-400 font-bold font-mono px-1">
              <span>10% (Low safety)</span>
              <span>20% (Recommended)</span>
              <span>40% (Extreme Safety)</span>
            </div>
          </div>

        </div>

        {/* RESULTS AND VISUAL TELEMETRY COLUMN */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* SAFE TIME CLOCK CARD */}
          <div className="bg-aero-navy text-white p-6 rounded-3xl shadow-lg border border-slate-800 space-y-5 relative overflow-hidden flex flex-col items-center justify-center text-center">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>

            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">SAFE FLIGHT TIME</h3>

            {/* HIGH-TECH TELEMETRY SVG TIMER */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
                {/* Background Track Circle */}
                <circle cx="50" cy="50" r="42" stroke="#1e293b" strokeWidth="5.5" fill="transparent" />
                
                {/* Active Progress Circle */}
                {/* Circle perimeter = 2 * PI * r = 2 * PI * 42 = 263.89 */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="42" 
                  stroke={safetyStatus.level === 'danger' ? '#ef4444' : safetyStatus.level === 'warning' ? '#f59e0b' : '#10b981'} 
                  strokeWidth="5.5" 
                  fill="transparent" 
                  strokeDasharray="263.89"
                  strokeDashoffset={263.89 - Math.min(263.89, (totalSeconds / 600) * 263.89)} // mapped up to 10 mins (600s)
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.4s ease, stroke 0.4s ease' }}
                />
              </svg>

              {/* Centered Digital Display */}
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold tracking-tight text-white font-mono leading-none">
                  {formatTimeText()}
                </span>
                <span className="text-[10px] font-bold text-aero-sky mt-1 uppercase tracking-wider">min:sec</span>
              </div>
            </div>

            {/* Metric descriptions */}
            <div className="w-full grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-800 text-center">
              <div className="space-y-0.5">
                <span className="text-[9px] text-slate-500 font-bold block uppercase">Usable Capacity:</span>
                <span className="font-semibold text-slate-300 font-mono">{(usableCapacityAh).toFixed(3)} Ah</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] text-slate-500 font-bold block uppercase">Average Current:</span>
                <span className="font-semibold text-slate-300 font-mono">{averageCurrent} Amps</span>
              </div>
            </div>
          </div>

          {/* DYNAMIC SAFETY WARNING */}
          <div className={`p-4 rounded-3xl border text-xs flex items-start space-x-3 transition-colors duration-300 ${safetyStatus.color}`}>
            {safetyStatus.level === 'safe' ? (
              <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-500 mt-0.5" />
            ) : (
              <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500 mt-0.5 animate-bounce" />
            )}
            <p className="font-light leading-relaxed">{safetyStatus.text}</p>
          </div>

          {/* DYNAMIC SVG LIPO FUEL CELL DIAGRAM */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3.5">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">LiPo Cell Visualization</span>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center space-y-4">
              
              {/* SVG battery design */}
              <div className="relative w-48 h-20 flex items-center justify-start bg-slate-900 border-2 border-slate-700 rounded-xl p-1 overflow-hidden">
                {/* Battery positive nub */}
                <div className="absolute right-[-4px] top-1/3 w-[6px] h-1/3 bg-slate-500 rounded-r"></div>

                {/* Battery segments representing:
                    - Safety Reserve (rightmost, yellow/orange warning bars)
                    - Active Usable Charge (leftmost, solid green bars)
                */}
                <div className="w-full h-full flex space-x-1">
                  
                  {/* Map charging blocks: say 10 blocks in total */}
                  {Array.from({ length: 10 }).map((_, idx) => {
                    // Reserve percentage represents the threshold
                    // say safetyReserve is 20%, that means 2 blocks on the right (indices 8, 9) are the reserve!
                    const reserveBlocksCount = Math.round(safetyReserve / 10);
                    const isReserveBlock = idx >= (10 - reserveBlocksCount);
                    
                    return (
                      <div 
                        key={idx}
                        className={`h-full flex-1 rounded-sm transition-all duration-300 ${
                          isReserveBlock 
                            ? 'bg-gradient-to-b from-amber-400 to-orange-500 opacity-60' // Reserve warning color
                            : 'bg-gradient-to-b from-emerald-400 to-emerald-500' // Safe usable capacity
                        }`}
                      ></div>
                    );
                  })}

                </div>
              </div>

              {/* Legend details */}
              <div className="w-full flex items-center justify-between text-[11px] font-medium text-slate-500 px-4">
                <div className="flex items-center space-x-1.5">
                  <div className="w-3.5 h-2 bg-emerald-500 rounded-sm"></div>
                  <span>Usable Charge ({100 - safetyReserve}%)</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="w-3.5 h-2 bg-orange-500 rounded-sm"></div>
                  <span>Limit Reserve ({safetyReserve}%)</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
