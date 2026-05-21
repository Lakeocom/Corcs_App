import React, { useState, useEffect } from 'react';
import { Ruler, Info, Compass, HelpCircle, ChevronRight, CornerDownRight } from 'lucide-react';

export default function CGCalculator() {
  // Inputs (in cm)
  const [rootChord, setRootChord] = useState(30); // Cr
  const [tipChord, setTipChord] = useState(18); // Ct
  const [wingspan, setWingspan] = useState(140); // b
  const [sweep, setSweep] = useState(5); // S (flecha / retraso de punta)
  const [cgPercent, setCgPercent] = useState(28); // %CG margin (25% - 35%)

  // Outputs (in cm)
  const [mac, setMac] = useState(0); // Cuerda Media Aerodinámica
  const [yMac, setYMac] = useState(0); // Posición Y (spanwise) de la MAC
  const [leMac, setLeMac] = useState(0); // Borde de ataque de la MAC (LE_MAC)
  const [cgFromRootLE, setCgFromRootLE] = useState(0); // CG medido desde borde de ataque en raíz

  // SVG parameters
  const svgWidth = 260;
  const svgHeight = 180;
  const paddingX = 20;
  const paddingY = 20;

  // Calculate CG and MAC
  useEffect(() => {
    const Cr = rootChord;
    const Ct = tipChord;
    const b = wingspan;
    const S = sweep;
    const percent = cgPercent / 100;

    // 1. Mean Aerodynamic Chord (MAC)
    // MAC = (2/3) * ((Cr^2 + Cr*Ct + Ct^2) / (Cr + Ct))
    const calculatedMac = (2 / 3) * ((Cr * Cr + Cr * Ct + Ct * Ct) / (Cr + Ct));
    setMac(Math.round(calculatedMac * 10) / 10);

    // 2. Spanwise position of MAC (yMac)
    // yMac = (b / 6) * ((Cr + 2*Ct) / (Cr + Ct))
    // We calculate for semiala (b_half = b / 2)
    const bHalf = b / 2;
    const calculatedYMac = (bHalf / 3) * ((Cr + 2 * Ct) / (Cr + Ct));
    setYMac(Math.round(calculatedYMac * 10) / 10);

    // 3. Leading Edge of MAC offset (leMac)
    // leMac = S * ((Cr + 2*Ct) / (3 * (Cr + Ct)))
    const calculatedLeMac = S * ((Cr + 2 * Ct) / (3 * (Cr + Ct)));
    setLeMac(Math.round(calculatedLeMac * 10) / 10);

    // 4. CG position from root leading edge
    // CG_root = LE_MAC + percent * MAC
    const calculatedCgRoot = calculatedLeMac + percent * calculatedMac;
    setCgFromRootLE(Math.round(calculatedCgRoot * 10) / 10);

  }, [rootChord, tipChord, wingspan, sweep, cgPercent]);

  // Dynamic SVG rendering coordinates
  // Semiala:
  // Root LE: (paddingX, paddingY)
  // Root TE: (paddingX, paddingY + Cr * scale)
  // Tip LE: (paddingX + bHalf * scale, paddingY + S * scale)
  // Tip TE: (paddingX + bHalf * scale, paddingY + S * scale + Ct * scale)

  const bHalfVal = wingspan / 2;
  const maxExtentY = Math.max(rootChord, sweep + tipChord);

  // Dynamic Scaling to fit the SVG window perfectly
  const scaleX = (svgWidth - 2 * paddingX) / bHalfVal;
  const scaleY = (svgHeight - 2 * paddingY) / maxExtentY;
  const scale = Math.min(scaleX, scaleY);

  // Coordinates scaled
  const rLE = { x: paddingX, y: paddingY };
  const rTE = { x: paddingX, y: paddingY + rootChord * scale };
  
  const tLE = { x: paddingX + bHalfVal * scale, y: paddingY + sweep * scale };
  const tTE = { x: paddingX + bHalfVal * scale, y: paddingY + (sweep + tipChord) * scale };

  // MAC line coordinates scaled
  const macX = paddingX + yMac * scale;
  const macLE_Y = paddingY + leMac * scale;
  const macTE_Y = paddingY + (leMac + mac) * scale;

  // CG Point scaled
  const cgPercentOffset = (cgPercent / 100) * mac;
  const cgY = macLE_Y + cgPercentOffset * scale;
  const cgX = macX;

  // Root projection CG point scaled (for pilot measurement)
  const rootCgY = paddingY + cgFromRootLE * scale;

  const getCgStabilityStatus = () => {
    if (cgPercent <= 27) return { label: 'Stable / Nose Heavy (Trainer)', color: 'bg-emerald-500 text-white' };
    if (cgPercent > 27 && cgPercent <= 31) return { label: 'Optimum / F3A Aerobatics', color: 'bg-sky-500 text-white' };
    return { label: 'Sensitive / Extreme 3D Flight', color: 'bg-amber-500 text-white' };
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* EXPLANATORY INFORMATION */}
      <div className="bg-gradient-to-r from-indigo-500/10 to-violet-500/10 rounded-2xl p-5 border border-indigo-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-indigo-700 font-bold">
            <Ruler className="h-5 w-5" />
            <h3 className="text-base font-extrabold text-indigo-900">Center of Gravity (CG) Location</h3>
          </div>
          <p className="text-sm text-slate-600 font-light leading-relaxed">
            The CG of a trapezoidal wing is calculated based on the **Mean Aerodynamic Chord (MAC)**. Balancing the model between **25% and 30%** of the MAC ensures a stable, neutral, and safe flight on the runway.
          </p>
        </div>
        <div className="shrink-0 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] text-slate-400 font-bold block tracking-wider uppercase">GEOMETRIC FORMULA</span>
          <span className="text-sm font-extrabold text-aero-navy font-mono">MAC = 2/3 * (Cr² + Cr·Ct + Ct²) / (Cr + Ct)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* INPUT PARAMETERS COLUMN */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
            <Compass className="h-5 w-5 text-indigo-600" />
            <span>Wing Geometry</span>
          </h3>

          {/* CR: CUERDA RAÍZ */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-700">Root Chord (Cr - Fuselage Root)</label>
              <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-aero-navy text-xs font-bold font-mono rounded">
                {rootChord} cm
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              step="1"
              value={rootChord}
              onChange={(e) => setRootChord(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[9px] text-slate-400 font-bold font-mono px-1">
              <span>10 cm (Park Flyer)</span>
              <span>35 cm (Medium Scale)</span>
              <span>60 cm (Large Wing)</span>
            </div>
          </div>

          {/* CT: CUERDA PUNTA */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-700">Tip Chord (Ct - Wingtip)</label>
              <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-aero-navy text-xs font-bold font-mono rounded">
                {tipChord} cm
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="1"
              value={tipChord}
              onChange={(e) => setTipChord(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[9px] text-slate-400 font-bold font-mono px-1">
              <span>5 cm</span>
              <span>25 cm</span>
              <span>50 cm</span>
            </div>
          </div>

          {/* WINGSPAN: ENVERGADURA */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-700">Full Wingspan (b)</label>
              <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-aero-navy text-xs font-bold font-mono rounded">
                {wingspan} cm / {(wingspan / 100).toFixed(2)} meters
              </span>
            </div>
            <input
              type="range"
              min="40"
              max="300"
              step="5"
              value={wingspan}
              onChange={(e) => setWingspan(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[9px] text-slate-400 font-bold font-mono px-1">
              <span>40 cm (Micro Drone)</span>
              <span>150 cm (Sport / Trainer)</span>
              <span>300 cm (Giant Glider)</span>
            </div>
          </div>

          {/* SWEEP: FLECHA / RETRASO */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-700">Wing Sweep (S - Wingtip setback offset)</label>
              <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-aero-navy text-xs font-bold font-mono rounded">
                {sweep} cm
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              step="1"
              value={sweep}
              onChange={(e) => setSweep(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[9px] text-slate-400 font-bold font-mono px-1">
              <span>0 cm (Straight wing)</span>
              <span>20 cm (Moderate sweep)</span>
              <span>60 cm (Delta wing or extreme sweep)</span>
            </div>
          </div>

          {/* CG PERCENTAGE MARGIN */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-700">Center of Gravity Margin (% of MAC)</label>
              <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-extrabold font-mono rounded">
                {cgPercent}% MAC
              </span>
            </div>
            <input
              type="range"
              min="25"
              max="35"
              step="1"
              value={cgPercent}
              onChange={(e) => setCgPercent(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[9px] text-slate-400 font-bold font-mono px-1">
              <span>25% (Stable / Trainer)</span>
              <span>30% (Neutral Sport)</span>
              <span>35% (Sensitive / Aerobatic)</span>
            </div>
          </div>

        </div>

        {/* RESULTS AND VISUAL DIAGRAM COLUMN */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* CALCULATED CG VALUES CARD */}
          <div className="bg-aero-navy text-white p-6 rounded-3xl shadow-lg border border-slate-800 space-y-5 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>

            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">FLIGHT BALANCE POINT</h3>

            <div className="space-y-4">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">CG DISTANCE FROM LEADING EDGE (AT ROOT / FUSELAGE):</span>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-mono">
                    {cgFromRootLE.toFixed(1)}
                  </span>
                  <span className="text-base font-bold text-aero-sky">cm</span>
                </div>
              </div>

              {/* Auxiliary calculation data */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-500 font-bold block uppercase">MAC Length:</span>
                  <span className="font-semibold text-slate-300 font-mono">{mac} cm</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-500 font-bold block uppercase">MAC Location (Span):</span>
                  <span className="font-semibold text-slate-300 font-mono">{yMac} cm</span>
                </div>
              </div>
            </div>

            {/* Stability label */}
            <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400 font-light">Behavior:</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getCgStabilityStatus().color}`}>
                {getCgStabilityStatus().label}
              </span>
            </div>
          </div>

          {/* DYNAMIC SCALE SVG WING DIAGRAM */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3.5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Scaled Wing Diagram</span>
              <span className="text-[10px] text-slate-400 font-medium">Geometric update</span>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center relative overflow-hidden p-2">
              
              {/* SVG Graphic drawing semiala */}
              <svg className="w-full h-44 drop-shadow-md" viewBox={`0 0 ${svgWidth} ${svgHeight}`} fill="none">
                
                {/* 1. Fuselage centerline indicator (dashed vertical on the left boundary) */}
                <line x1={paddingX} y1={5} x2={paddingX} y2={svgHeight - 5} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,3" />
                <text x={paddingX - 12} y={svgHeight / 2} fill="#64748b" fontSize="7" fontWeight="bold" writingMode="tb" textAnchor="middle">FUSELAGE</text>

                {/* 2. Scaled Trapezoidal Wing Segment Polygon */}
                <polygon 
                  points={`${rLE.x},${rLE.y} ${tLE.x},${tLE.y} ${tTE.x},${tTE.y} ${rTE.x},${rTE.y}`} 
                  fill="#f1f5f9" 
                  stroke="#64748b" 
                  strokeWidth="1.5" 
                />

                {/* 3. Aerodynamic Chord Line (MAC) drawn on the wing */}
                <line 
                  x1={macX} 
                  y1={macLE_Y} 
                  x2={macX} 
                  y2={macTE_Y} 
                  stroke="#ef4444" 
                  strokeWidth="1.5" 
                  strokeDasharray="2,2" 
                />
                
                {/* MAC label */}
                <text x={macX + 6} y={(macLE_Y + macTE_Y) / 2} fill="#ef4444" fontSize="7" fontWeight="bold" textAnchor="start">MAC</text>

                {/* 4. Root CG Projection Line (dashed line from CG to Fuselage/Root chord) */}
                <line 
                  x1={cgX} 
                  y1={cgY} 
                  x2={rLE.x} 
                  y2={rootCgY} 
                  stroke="#eab308" 
                  strokeWidth="1" 
                  strokeDasharray="3,3" 
                />

                {/* 5. Center of Gravity Symbol (yellow/black quadrant aviation circle) */}
                <g transform={`translate(${cgX}, ${cgY})`}>
                  {/* Outer circle ring */}
                  <circle cx="0" cy="0" r="6" fill="#000" />
                  {/* Opposing Yellow quadrants */}
                  <path d="M 0 0 L 0 -6 A 6 6 0 0 1 6 0 Z" fill="#facc15" />
                  <path d="M 0 0 L 0 6 A 6 6 0 0 1 -6 0 Z" fill="#facc15" />
                  {/* Center dot */}
                  <circle cx="0" cy="0" r="1" fill="#fff" />
                </g>

                {/* CG Label near the circle */}
                <text x={cgX + 10} y={cgY + 3} fill="#0f172a" fontSize="8" fontWeight="extrabold">CG</text>

                {/* 6. Root Hanger ruler measurement marker */}
                {/* Dimension line from root LE to projected CG point */}
                <path d={`M ${rLE.x - 3} ${rLE.y} L ${rLE.x - 7} ${rLE.y} M ${rLE.x - 5} ${rLE.y} L ${rLE.x - 5} ${rootCgY} M ${rLE.x - 3} ${rootCgY} L ${rLE.x - 7} ${rootCgY}`} stroke="#818cf8" strokeWidth="1" />
                
                {/* Measurement value text */}
                <text x={rLE.x - 10} y={(rLE.y + rootCgY) / 2 + 2} fill="#4f46e5" fontSize="7" fontWeight="bold" textAnchor="end">
                  {cgFromRootLE} cm
                </text>
              </svg>

            </div>

            {/* Direct measuring guideline instruction */}
            <div className="flex items-start space-x-2 text-[11px] text-slate-500 font-light bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <CornerDownRight className="h-4 w-4 shrink-0 text-indigo-600 mt-0.5" />
              <p>
                **How to balance**: Take your ruler and measure exactly **{cgFromRootLE} cm** back, starting from the wing leading edge right at the fuselage joint (root), and mark that point on both sides of the fuselage.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
