import React, { useState, useEffect } from 'react';
import { Gauge, Info, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';

export default function ServoAssistant() {
  // Inputs
  const [surfaceLength, setSurfaceLength] = useState(30); // L in cm (rudder length)
  const [surfaceChord, setSurfaceChord] = useState(5); // C in cm (rudder width/chord)
  const [maxSpeed, setMaxSpeed] = useState(120); // V in km/h (max airspeed)
  const [deflectionAngle, setDeflectionAngle] = useState(30); // theta in degrees (max deflection angle)
  const [airplaneType, setAirplaneType] = useState('sport'); // trainer, scale, sport, 3d

  // Outputs
  const [torqueKgCm, setTorqueKgCm] = useState(0);
  const [torqueOzIn, setTorqueOzIn] = useState(0);
  const [gearType, setGearType] = useState('');
  const [servoSpeed, setServoSpeed] = useState('');
  const [servoType, setServoType] = useState('');
  const [deadbandText, setDeadbandText] = useState('');

  // Aircraft configurations
  const aircraftConfigs = {
    trainer: {
      label: 'Trainer (Nylon Gears OK)',
      gears: 'Nylon / Plastic acceptable (Metal optional)',
      speed: 'Standard (~0.16s - 0.22s / 60°)',
      type: 'Standard Analog (DC)',
      deadband: 'Regular deadband (~4-5µs ok)'
    },
    scale: {
      label: 'Scale Model (High Vibration)',
      gears: 'Metal gears highly recommended (due to vibration)',
      speed: 'Moderate-Fast (~0.12s - 0.16s / 60°)',
      type: 'High Precision Digital (Coreless)',
      deadband: 'Low deadband (~2µs for precise centering)'
    },
    sport: {
      label: 'Sport / Pattern / F3A',
      gears: 'Metal mandatory (high G-loads)',
      speed: 'Fast (~0.10s - 0.13s / 60°)',
      type: 'Digital Coreless or Brushless',
      deadband: 'Very low deadband (~1-2µs)'
    },
    '3d': {
      label: 'Extreme 3D Aerobatics',
      gears: 'Reinforced Metal (Double Ball Bearing)',
      speed: 'Ultra Fast (< 0.09s / 60°)',
      type: 'Digital Brushless (High holding torque)',
      deadband: 'Minimal deadband (~1µs ultra fast response)'
    }
  };

  // Perform aerodynamic torque calculation
  useEffect(() => {
    // Torque formula for control surfaces:
    // Torque (kg-cm) = (V^2 * C^2 * L * sin(theta)) / (4.9 * 10^6)
    const thetaRad = (deflectionAngle * Math.PI) / 180;
    const speedSquared = maxSpeed * maxSpeed;
    const chordSquared = surfaceChord * surfaceChord;
    
    // Aerodynamic torque calculation
    let calculatedTorque = (speedSquared * chordSquared * surfaceLength * Math.sin(thetaRad)) / 4900000;
    
    // Safety Factor multiplier based on airplane type
    let safetyFactor = 1.2; // 20% safety factor baseline
    if (airplaneType === '3d') safetyFactor = 1.6;
    else if (airplaneType === 'sport') safetyFactor = 1.35;
    else if (airplaneType === 'scale') safetyFactor = 1.3;
    
    calculatedTorque = calculatedTorque * safetyFactor;
    
    // Round to 2 decimals
    const finalTorqueKgCm = Math.max(0.1, Math.round(calculatedTorque * 100) / 100);
    setTorqueKgCm(finalTorqueKgCm);
    
    // Convert to oz-in (1 kg-cm = 13.887 oz-in)
    const finalTorqueOzIn = Math.round(finalTorqueKgCm * 13.887 * 10) / 10;
    setTorqueOzIn(finalTorqueOzIn);

    // Apply recommendations based on active aircraft config
    const currentRec = aircraftConfigs[airplaneType];
    setGearType(currentRec.gears);
    setServoSpeed(currentRec.speed);
    setServoType(currentRec.type);
    setDeadbandText(currentRec.deadband);

  }, [surfaceLength, surfaceChord, maxSpeed, deflectionAngle, airplaneType]);

  // Dynamic color coding based on torque
  const getTorqueSeverityColor = () => {
    if (torqueKgCm < 2) return 'bg-emerald-500 text-white'; // Micro/Standard small
    if (torqueKgCm >= 2 && torqueKgCm < 6) return 'bg-sky-500 text-white'; // Mid-torque
    if (torqueKgCm >= 6 && torqueKgCm < 15) return 'bg-amber-500 text-white'; // High-torque
    return 'bg-red-500 text-white'; // Giant/Extreme torque
  };

  const getTorqueClassText = () => {
    if (torqueKgCm < 2) return 'Micro / Mini (e.g. 9g to 17g)';
    if (torqueKgCm >= 2 && torqueKgCm < 6) return 'Standard Servo (e.g. 3kg to 6kg)';
    if (torqueKgCm >= 6 && torqueKgCm < 15) return 'High-Torque Standard (e.g. 10kg to 15kg)';
    return 'Giant Scale / Ultra Torque (> 15kg-cm)';
  };

  // Speed level helper for air speed visual representation
  const speedScaleWidth = Math.min(100, (maxSpeed / 300) * 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* EXPLANATORY HEADER */}
      <div className="bg-gradient-to-r from-sky-500/10 to-blue-500/10 rounded-2xl p-5 border border-sky-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-aero-cobalt font-bold">
            <Activity className="h-5 w-5 animate-pulse" />
            <h3 className="text-base">Aerodynamic Torque Formula</h3>
          </div>
          <p className="text-sm text-slate-600 font-light leading-relaxed">
            Calculates the wind load exerted on the control surface during fast flight. The servo must exceed this torque plus a safety factor to prevent control surface deflection slip ("blowback") in flight.
          </p>
        </div>
        <div className="shrink-0 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] text-slate-400 font-bold block tracking-wider uppercase">PHYSICAL FORMULA</span>
          <span className="text-sm font-extrabold text-aero-navy font-mono">Torque = f(V², Chord², L, sin(θ))</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* INPUT PANEL */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
            <Gauge className="h-5 w-5 text-aero-cobalt" />
            <span>Dimensions & Airspeed</span>
          </h3>

          {/* SELECTOR: AIRCRAFT TYPE */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 block">Aircraft Type & Flying Style</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.keys(aircraftConfigs).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setAirplaneType(key)}
                  className={`py-2 px-1 text-xs font-bold rounded-xl border text-center transition-all ${
                    airplaneType === key
                      ? 'bg-aero-cobalt text-white border-aero-cobalt shadow-sm scale-105'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {aircraftConfigs[key].label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* SLIDER: LARGO TIMÓN (L) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-700">Control Surface Length (Spanwise Length)</label>
              <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-aero-navy text-xs font-bold font-mono rounded">
                {surfaceLength} cm
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="120"
              step="1"
              value={surfaceLength}
              onChange={(e) => setSurfaceLength(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-aero-cobalt"
            />
            <div className="flex justify-between text-[9px] text-slate-400 font-bold font-mono px-1">
              <span>5 cm (Micro)</span>
              <span>60 cm (Medium Size)</span>
              <span>120 cm (Giant Scale)</span>
            </div>
          </div>

          {/* SLIDER: ANCHO TIMÓN (C) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-700">Control Surface Width (Chord Length)</label>
              <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-aero-navy text-xs font-bold font-mono rounded">
                {surfaceChord} cm
              </span>
            </div>
            <input
              type="range"
              min="1.5"
              max="25.0"
              step="0.5"
              value={surfaceChord}
              onChange={(e) => setSurfaceChord(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-aero-cobalt"
            />
            <div className="flex justify-between text-[9px] text-slate-400 font-bold font-mono px-1">
              <span>1.5 cm</span>
              <span>12 cm</span>
              <span>25 cm (Extreme 3D chord)</span>
            </div>
          </div>

          {/* SLIDER: VELOCIDAD MÁXIMA (V) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-700">Estimated Maximum Airspeed</label>
              <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-aero-navy text-xs font-bold font-mono rounded">
                {maxSpeed} km/h / {(maxSpeed * 0.621371).toFixed(0)} mph
              </span>
            </div>
            <input
              type="range"
              min="30"
              max="300"
              step="5"
              value={maxSpeed}
              onChange={(e) => setMaxSpeed(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-aero-cobalt"
            />
            
            {/* Velocity color indicator bar */}
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1 flex border border-slate-200">
              <div 
                className={`h-full transition-all duration-300 ${
                  maxSpeed < 80 ? 'bg-emerald-500' : maxSpeed < 160 ? 'bg-sky-500' : maxSpeed < 230 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${speedScaleWidth}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[9px] text-slate-400 font-bold font-mono px-1">
              <span>30 km/h (Slow)</span>
              <span>150 km/h (Fast Sport)</span>
              <span>300 km/h (Turbine Jet)</span>
            </div>
          </div>

          {/* SLIDER: ANGULO DE DEFLEXION */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-700">Maximum Deflection Angle (Rudder/Elevator)</label>
              <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-aero-navy text-xs font-bold font-mono rounded">
                {deflectionAngle}° degrees
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="65"
              step="1"
              value={deflectionAngle}
              onChange={(e) => setDeflectionAngle(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-aero-cobalt"
            />
            <div className="flex justify-between text-[9px] text-slate-400 font-bold font-mono px-1">
              <span>10° (Scale flight)</span>
              <span>35° (Acrobatic / F3A)</span>
              <span>65° (Extreme 3D throw)</span>
            </div>
          </div>

        </div>

        {/* RESULTS AND INTERACTIVE DIAGRAM */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* TORQUE REQUIRED OUTPUT CARD */}
          <div className="bg-aero-navy text-white p-6 rounded-3xl shadow-lg border border-slate-800 space-y-4 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl"></div>

            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">CALCULATED SERVO TORQUE</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">METRIC REQUIRED</span>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-extrabold tracking-tight text-white font-mono">
                    {torqueKgCm.toFixed(2)}
                  </span>
                  <span className="text-xs font-bold text-aero-sky">kg-cm</span>
                </div>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">IMPERIAL REQUIRED</span>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-extrabold tracking-tight text-white font-mono">
                    {torqueOzIn.toFixed(1)}
                  </span>
                  <span className="text-xs font-bold text-aero-sky">oz-in</span>
                </div>
              </div>
            </div>

            {/* Torque class tag */}
            <div className="pt-3.5 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-light">Recommended Servo Class:</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getTorqueSeverityColor()}`}>
                {getTorqueClassText()}
              </span>
            </div>
          </div>

          {/* PHYSICAL RECOMMENDATIONS */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <span>Recommended Servo Specs</span>
            </h3>

            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-500 font-light">Gearing Material:</span>
                <span className="font-bold text-slate-800 text-right">{gearType}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-500 font-light">Servo Transit Speed:</span>
                <span className="font-bold text-slate-800 text-right">{servoSpeed}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-500 font-light">Electronic Type:</span>
                <span className="font-bold text-slate-800 text-right">{servoType}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-500 font-light">Deadband Width:</span>
                <span className="font-bold text-slate-800 text-right">{deadbandText}</span>
              </div>
            </div>
          </div>

          {/* INTERACTIVE SVG DEFLEXION SCHEMATIC */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3.5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Dynamic Hinge Schematic</span>
              <span className="text-[10px] text-slate-400 font-medium">Interactive movement</span>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl h-44 flex items-center justify-center relative overflow-hidden">
              
              {/* Speed indicators (wind streams behind) */}
              <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-1/4 left-4 w-12 h-0.5 bg-slate-400 rounded animate-pulse" style={{ animationDuration: '0.8s' }}></div>
                <div className="absolute top-1/2 left-8 w-16 h-0.5 bg-slate-400 rounded animate-pulse" style={{ animationDuration: '1.2s' }}></div>
                <div className="absolute bottom-1/4 left-3 w-10 h-0.5 bg-slate-400 rounded animate-pulse" style={{ animationDuration: '0.6s' }}></div>
              </div>

              {/* Dynamic Hinge Representation */}
              <svg className="w-full h-full p-2" viewBox="0 0 200 120" fill="none">
                {/* Airflow arrows - they grow thicker/longer based on speed and deflection */}
                {maxSpeed > 100 && (
                  <>
                    {/* Air force pushing against surface */}
                    <path 
                      d={`M 155 ${60 - deflectionAngle * 0.4} L 135 60`} 
                      stroke="#ef4444" 
                      strokeWidth={Math.max(1, maxSpeed / 80)} 
                      markerEnd="url(#arrow)" 
                    />
                    <path 
                      d={`M 150 ${60 + 20 - deflectionAngle * 0.3} L 130 65`} 
                      stroke="#ef4444" 
                      strokeWidth={Math.max(1, maxSpeed / 80)} 
                      markerEnd="url(#arrow)" 
                    />
                  </>
                )}

                {/* SVG Marker definition for aerodynamic force arrows */}
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 2 L 10 5 L 0 8 z" fill="#ef4444" />
                  </marker>
                </defs>

                {/* Fixed Stabilizer Tail structure (grey block) */}
                <rect x="25" y="45" width="60" height="30" rx="3" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
                <text x="55" y="62" fill="#475569" fontSize="9" fontWeight="bold" textAnchor="middle">STABILIZER</text>
                
                {/* Hinge Joint Line (circle pin) */}
                <circle cx="85" cy="60" r="4.5" fill="#f97316" stroke="#ea580c" strokeWidth="1.5" />
                
                {/* ROTATING CONTROL SURFACE */}
                {/* Optimized to use standard robust SVG transform attribute instead of CSS transform style */}
                <g transform={`rotate(${deflectionAngle}, 85, 60)`}>
                  {/* Trapezoidal rudder surface */}
                  <polygon points="85,48 150,52 145,68 85,72" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />
                  {/* Horn mount for linkage */}
                  <polygon points="92,72 88,86 98,86 96,72" fill="#475569" />
                  <circle cx="93" cy="83" r="2" fill="#fff" />
                  
                  <text x="115" y="63" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">RUDDER</text>
                </g>

                {/* Fixed Servo wire linkage representation */}
                <line x1="93" y1="83" x2="60" y2="83" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3,1" />
                
                {/* Angle notation arc */}
                <path 
                  d={`M 110 60 A 25 25 0 0 1 ${85 + 25 * Math.cos(deflectionAngle * Math.PI / 180)} ${60 + 25 * Math.sin(deflectionAngle * Math.PI / 180)}`} 
                  stroke="#f97316" 
                  strokeWidth="1.5" 
                  fill="none" 
                  strokeDasharray="4,2" 
                />
                
                {/* Dynamic Angle Text */}
                <text x="120" y="32" fill="#f97316" fontSize="10" fontWeight="bold" textAnchor="middle">Deflection: {deflectionAngle}°</text>
              </svg>

            </div>

            <div className="flex items-start space-x-2 text-[11px] text-slate-500 font-light bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <Info className="h-4 w-4 shrink-0 text-aero-cobalt mt-0.5" />
              <p>
                Drag the **Maximum Deflection Angle** slider to watch the rudder pivot dynamically and check the opposing wind pressure shown in red.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
