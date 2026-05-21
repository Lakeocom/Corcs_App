import React, { useState, useEffect } from 'react';
import { Zap, Info, AlertTriangle, Weight, Gauge, Plane, Battery } from 'lucide-react';

export default function MotorConverter() {
  // Inputs
  const [nitroSize, setNitroSize] = useState(0.46); // .46 cu in
  const [strokeType, setStrokeType] = useState('2T'); // 2T or 4T
  const [modelWeight, setModelWeight] = useState(6.5); // lbs
  const [flightStyle, setFlightStyle] = useState('sport'); // trainer, sport, acrobatic, 3d

  // Outputs
  const [wattsRequired, setWattsRequired] = useState(0);
  const [wattsNitroEquivalent, setWattsNitroEquivalent] = useState(0);
  const [finalWattsRecommendation, setFinalWattsRecommendation] = useState(0);
  const [recommendedMotor, setRecommendedMotor] = useState('');
  const [recommendedKV, setRecommendedKV] = useState('');
  const [recommendedLipo, setRecommendedLipo] = useState('');
  const [recommendedESC, setRecommendedESC] = useState('');
  const [recommendedProp, setRecommendedProp] = useState('');

  // Glower style description and multiplier
  const styleConfig = {
    trainer: { label: 'Trainer / Scale Flight', mult: 100, desc: 'Gentle flying, gliding, and basic maneuvers.' },
    sport: { label: 'Sport / Pattern Flight', mult: 150, desc: 'Loops, rolls, and fast flying with power reserves.' },
    acrobatic: { label: 'Advanced Aerobatics / F3A', mult: 200, desc: 'Extreme precision, vertical climb capability.' },
    '3d': { label: '3D / Extreme Flight', mult: 250, desc: 'Torque rolls, harriers, power-to-weight ratio > 2:1.' }
  };

  // Nitro engine database to match equivalents
  const nitroDb = [
    { size: 0.15, watts2T: 280, watts4T: 200, motor: '2830 to 2836', kv: '1100 - 1300 KV', lipo: '3S (11.1V)', esc: '30A - 40A', prop: '8x4 to 9x6' },
    { size: 0.25, watts2T: 500, watts4T: 350, motor: '3536', kv: '1000 - 1200 KV', lipo: '3S - 4S (11.1V - 14.8V)', esc: '40A - 50A', prop: '10x5 to 11x6' },
    { size: 0.40, watts2T: 850, watts4T: 600, motor: '3548 or 4250', kv: '800 - 900 KV', lipo: '4S (14.8V)', esc: '60A - 70A', prop: '11x7 to 12x6' },
    { size: 0.46, watts2T: 1000, watts4T: 700, motor: '4250', kv: '750 - 850 KV', lipo: '4S (14.8V)', esc: '60A - 80A', prop: '12x6 to 13x8' },
    { size: 0.55, watts2T: 1200, watts4T: 850, motor: '4258', kv: '600 - 700 KV', lipo: '5S - 6S (18.5V - 22.2V)', esc: '80A', prop: '13x8 to 14x7' },
    { size: 0.60, watts2T: 1400, watts4T: 1000, motor: '5055', kv: '500 - 600 KV', lipo: '6S (22.2V)', esc: '80A - 90A', prop: '14x8 to 15x8' },
    { size: 0.90, watts2T: 2000, watts4T: 1400, motor: '5065', kv: '350 - 450 KV', lipo: '6S - 8S (22.2V - 29.6V)', esc: '100A', prop: '15x10 to 16x10' },
    { size: 1.20, watts2T: 2700, watts4T: 1900, motor: '6364', kv: '230 - 280 KV', lipo: '8S - 10S (29.6V - 37.0V)', esc: '120A', prop: '18x10 to 20x10' },
    { size: 1.60, watts2T: 3600, watts4T: 2500, motor: '6374', kv: '150 - 200 KV', lipo: '10S - 12S (37.0V - 44.4V)', esc: '120A - 160A', prop: '22x10 to 24x12' }
  ];

  // Helper function to format displacement correctly
  // If val < 1.0 (like 0.46), format as .46
  // If val >= 1.0 (like 1.20), format as 1.20
  const formatDisplacement = (val) => {
    return val < 1.0 ? `.${Math.round(val * 100)}` : val.toFixed(2);
  };

  // Perform Calculations
  useEffect(() => {
    // 1. Calculate watts based on model weight and flight style
    const wWeight = modelWeight * styleConfig[flightStyle].mult;
    setWattsRequired(Math.round(wWeight));

    // 2. Find closest nitro engine in database
    const closest = nitroDb.reduce((prev, curr) => {
      return Math.abs(curr.size - nitroSize) < Math.abs(prev.size - nitroSize) ? curr : prev;
    });

    const wNitro = strokeType === '2T' ? closest.watts2T : closest.watts4T;
    setWattsNitroEquivalent(wNitro);

    // 3. Recommended power is the maximum of the direct conversion or weight requirement
    const finalWatts = Math.max(wWeight, wNitro);
    setFinalWattsRecommendation(Math.round(finalWatts));

    // 4. Generate recommendations based on the final Watts recommendation
    let recMotor = '';
    let recKV = '';
    let recLipo = '';
    let recESC = '';
    let recProp = '';

    if (finalWatts < 350) {
      recMotor = '2830 (e.g. 2212) or 2836';
      recKV = '1100 - 1400 KV';
      recLipo = '3S LiPo (11.1V)';
      recESC = '30A';
      recProp = '9x4.7 or 9x6';
    } else if (finalWatts >= 350 && finalWatts < 700) {
      recMotor = '3536 or 3542';
      recKV = '950 - 1100 KV';
      recLipo = '3S - 4S LiPo (11.1V - 14.8V)';
      recESC = '40A - 50A';
      recProp = '10x5 to 11x5.5';
    } else if (finalWatts >= 700 && finalWatts < 1100) {
      recMotor = '3548 or 4250';
      recKV = '750 - 900 KV';
      recLipo = '4S LiPo (14.8V)';
      recESC = '60A - 70A';
      recProp = '12x6 or 13x6.5';
    } else if (finalWatts >= 1100 && finalWatts < 1600) {
      recMotor = '4258 or 5055';
      recKV = '500 - 650 KV';
      recLipo = '6S LiPo (22.2V)';
      recESC = '80A';
      recProp = '14x7 or 15x8';
    } else if (finalWatts >= 1600 && finalWatts < 2400) {
      recMotor = '5065';
      recKV = '320 - 400 KV';
      recLipo = '6S - 8S LiPo (22.2V - 29.6V)';
      recESC = '100A';
      recProp = '16x10 or 17x8';
    } else {
      recMotor = '6364 or 6374';
      recKV = '170 - 240 KV';
      recLipo = '10S - 12S LiPo (37.0V - 44.4V)';
      recESC = '120A - 160A Opto';
      recProp = '19x10 to 22x10';
    }

    setRecommendedMotor(recMotor);
    setRecommendedKV(recKV);
    setRecommendedLipo(recLipo);
    setRecommendedESC(recESC);
    setRecommendedProp(recProp);

  }, [nitroSize, strokeType, modelWeight, flightStyle]);

  const commonNitroSizes = [0.15, 0.25, 0.40, 0.46, 0.60, 0.90, 1.20, 1.60];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* FORMULA EXPLANATION BANNER */}
      <div className="bg-gradient-to-r from-aero-cobalt/10 to-aero-sky/10 rounded-2xl p-5 border border-aero-sky/25 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-aero-cobalt font-bold">
            <Info className="h-5 w-5" />
            <h3 className="text-base">Power-to-Weight Conversion Formula</h3>
          </div>
          <p className="text-sm text-slate-600 font-light leading-relaxed">
            Standard RC aviation engineering rules state that we calculate approximately **150 to 200 Watts per pound (W/lb)** of model weight to guarantee optimal performance.
          </p>
        </div>
        <div className="shrink-0 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] text-slate-400 font-bold block tracking-wider uppercase">RECOMMENDED FORMULA</span>
          <span className="text-sm md:text-base font-extrabold text-aero-navy font-mono">Watts = Weight (lbs) x Multiplier</span>
        </div>
      </div>

      {/* MAIN CALCULATOR GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* INPUTS COLUMN */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
            <Weight className="h-5 w-5 text-aero-cobalt" />
            <span>Aircraft Parameters</span>
          </h3>

          {/* NITRO ENGINE SIZE */}
          <div className="space-y-3.5">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-700">Original Nitro Displacement (cu. in.)</label>
              <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-aero-navy text-sm font-extrabold font-mono rounded-lg">
                {formatDisplacement(nitroSize)} cu. in.
              </span>
            </div>
            
            {/* Quick Presets */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {commonNitroSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setNitroSize(size)}
                  className={`py-1.5 px-1 text-xs font-bold font-mono rounded-lg border transition-all ${
                    Math.abs(nitroSize - size) < 0.01
                      ? 'bg-aero-cobalt text-white border-aero-cobalt shadow-sm scale-105'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {formatDisplacement(size)}
                </button>
              ))}
            </div>

            <input
              type="range"
              min="0.10"
              max="2.00"
              step="0.01"
              value={nitroSize}
              onChange={(e) => setNitroSize(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-aero-cobalt"
            />
          </div>

          {/* ENGINE STROKE TYPE (2T vs 4T) */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 block">Nitro Engine Stroke</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setStrokeType('2T')}
                className={`py-3 px-4 rounded-xl border flex flex-col items-center justify-center transition-all ${
                  strokeType === '2T'
                    ? 'border-aero-cobalt bg-sky-50/50 text-aero-navy shadow-sm ring-1 ring-aero-cobalt'
                    : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                }`}
              >
                <span className="font-bold text-base">2-Stroke (2T)</span>
                <span className="text-[10px] text-slate-400 font-light mt-0.5">Higher power per displacement</span>
              </button>
              <button
                type="button"
                onClick={() => setStrokeType('4T')}
                className={`py-3 px-4 rounded-xl border flex flex-col items-center justify-center transition-all ${
                  strokeType === '4T'
                    ? 'border-aero-cobalt bg-sky-50/50 text-aero-navy shadow-sm ring-1 ring-aero-cobalt'
                    : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                }`}
              >
                <span className="font-bold text-base">4-Stroke (4T)</span>
                <span className="text-[10px] text-slate-400 font-light mt-0.5">Lower Watts (~30% power reduction)</span>
              </button>
            </div>
          </div>

          {/* MODEL WEIGHT */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-700">Model Weight (Ready-to-fly)</label>
              <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg">
                {modelWeight.toFixed(1)} lbs / {(modelWeight * 0.453592).toFixed(2)} kg
              </span>
            </div>
            
            <input
              type="range"
              min="1.0"
              max="25.0"
              step="0.1"
              value={modelWeight}
              onChange={(e) => setModelWeight(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-aero-cobalt"
            />
            
            <div className="flex justify-between text-[10px] text-slate-400 font-bold font-mono px-1">
              <span>1.0 lb (Park Flyer)</span>
              <span>10.0 lbs (Medium Size)</span>
              <span>25.0 lbs (Giant Scale)</span>
            </div>
          </div>

          {/* FLIGHT STYLE SELECTOR */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 block">Desired Flight Style</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.keys(styleConfig).map((key) => {
                const config = styleConfig[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFlightStyle(key)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      flightStyle === key
                        ? 'border-aero-cobalt bg-sky-50/50 text-aero-navy shadow-sm ring-1 ring-aero-cobalt scale-[1.01]'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold block">{config.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                        flightStyle === key ? 'bg-aero-cobalt text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {config.mult} W/lb
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-light leading-none block mt-1.5">{config.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* RESULTS COLUMN */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* WATTS CALCULATION CARD */}
          <div className="bg-aero-navy text-white p-6 rounded-3xl shadow-lg border border-slate-800 space-y-5 relative overflow-hidden">
            {/* Ambient glowing circle */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-aero-cobalt/20 rounded-full blur-2xl"></div>

            <h3 className="text-base font-bold text-slate-400 uppercase tracking-widest leading-none">POWER CALCULATION</h3>
            
            <div className="space-y-4">
              {/* Main watts display */}
              <div className="space-y-1">
                <span className="text-[11px] text-slate-400 font-semibold block uppercase">RECOMMENDED BRUSHLESS POWER</span>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-4xl md:text-5xl font-extrabold tracking-tight text-white font-mono">
                    {finalWattsRecommendation}
                  </span>
                  <span className="text-lg font-bold text-aero-sky">Watts</span>
                </div>
              </div>

              {/* Side comparisons */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Nitro Engine Equiv:</span>
                  <span className="text-sm font-bold text-slate-300 font-mono">{wattsNitroEquivalent} W</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Weight Minimum:</span>
                  <span className="text-sm font-bold text-slate-300 font-mono">{wattsRequired} W</span>
                </div>
              </div>
            </div>

            {/* Micro warning if weight req exceeds nitro conversion */}
            {wattsRequired > wattsNitroEquivalent && (
              <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl flex items-start space-x-2 text-xs text-amber-300">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-400" />
                <p className="font-light leading-snug">
                  Your flight style requires more power ({wattsRequired}W) than a standard replacement of the Nitro engine ({wattsNitroEquivalent}W). We have suggested the higher value.
                </p>
              </div>
            )}
          </div>

          {/* PHYSICAL RECOMMENDATIONS */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
              <Zap className="h-5 w-5 text-amber-500" />
              <span>Suggested Electric Setup</span>
            </h3>

            <div className="space-y-4">
              
              {/* Dynamic Lipo/ESC/Motor list */}
              <div className="grid grid-cols-1 gap-3.5">
                
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-amber-50 rounded-xl text-amber-500">
                      <Gauge className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">BRUSHLESS MOTOR SIZE</span>
                      <span className="text-sm font-extrabold text-slate-800">{recommendedMotor}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-sky-50 rounded-xl text-aero-cobalt">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">RECOMMENDED KV RATING</span>
                      <span className="text-sm font-extrabold text-slate-800">{recommendedKV}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-50 rounded-xl text-red-500">
                      <Battery className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">LIPO BATTERY CONFIGURATION</span>
                      <span className="text-sm font-extrabold text-slate-800">{recommendedLipo}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">SPEED CONTROLLER (ESC)</span>
                      <span className="text-sm font-extrabold text-slate-800">{recommendedESC}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-50 rounded-xl text-indigo-500">
                      <Plane className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">SUGGESTED TEST PROPELLER</span>
                      <span className="text-sm font-extrabold text-slate-800">{recommendedProp}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* DYNAMIC SVG GRAPHIC */}
              <div className="bg-slate-100 rounded-2xl p-4 border border-slate-200 flex items-center justify-center space-x-6">
                <svg className="w-24 h-24 text-slate-600 drop-shadow-sm" viewBox="0 0 100 100" fill="none">
                  {/* Motor stator base */}
                  <rect x="35" y="45" width="30" height="25" rx="3" fill="#64748b" />
                  {/* Motor housing copper coils */}
                  <rect x="40" y="30" width="20" height="15" fill="#f59e0b" />
                  <line x1="43" y1="30" x2="43" y2="45" stroke="#d97706" strokeWidth="2" />
                  <line x1="47" y1="30" x2="47" y2="45" stroke="#d97706" strokeWidth="2" />
                  <line x1="51" y1="30" x2="51" y2="45" stroke="#d97706" strokeWidth="2" />
                  <line x1="55" y1="30" x2="55" y2="45" stroke="#d97706" strokeWidth="2" />
                  <line x1="57" y1="30" x2="57" y2="45" stroke="#d97706" strokeWidth="2" />
                  {/* Rotor bell casing */}
                  <path d="M30 25 h40 v8 a5 5 0 0 1 -5 5 h-30 a5 5 0 0 1 -5 -5 z" fill="#0f172a" />
                  {/* Prop shaft */}
                  <rect x="48" y="10" width="4" height="15" fill="#94a3b8" />
                  {/* Prop spinner nut */}
                  <path d="M47 10 L50 4 L53 10 Z" fill="#475569" stroke="#334155" strokeWidth="1" />
                  
                  {/* Spinning indicator ring */}
                  <circle cx="50" cy="50" r="28" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="6,4" className="animate-spin" style={{ transformOrigin: '50px 50px', animationDuration: finalWattsRecommendation > 1500 ? '0.8s' : '2s' }} />
                </svg>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800">Motor Hub View</h4>
                  <p className="text-[10px] text-slate-500 font-light leading-snug">
                    The suggested brushless motor has the ideal torque to spin a **{recommendedProp ? recommendedProp.split(' ')[0] : ''}** propeller efficiently.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
