import React from 'react';
import { Plane, Zap, Gauge, Ruler, Battery, Compass, AlertCircle, Wind, Thermometer, ShieldAlert } from 'lucide-react';

export default function Dashboard({ setActiveTab }) {
  const tools = [
    {
      id: 'motor',
      name: 'Nitro to Electric Converter',
      desc: 'Find the equivalent brushless motor, propeller, and LiPo battery setup to retire your glow engine.',
      icon: Zap,
      color: 'from-amber-500 to-orange-600',
      badge: 'Power & LiPo'
    },
    {
      id: 'servo',
      name: 'Servo Assistant',
      desc: 'Calculate the aerodynamic flight torque required on control surfaces to prevent servo blowback and select the ideal gearing.',
      icon: Gauge,
      color: 'from-sky-500 to-blue-600',
      badge: 'Control & Torque'
    },
    {
      id: 'cg',
      name: 'Center of Gravity Calculator',
      desc: 'Determine the exact balance point (25%-30% MAC) of your trapezoidal wing layout for stable and safe flight.',
      icon: Ruler,
      color: 'from-indigo-500 to-violet-600',
      badge: 'Stability'
    },
    {
      id: 'flight',
      name: 'Flight Time & Batteries',
      desc: 'Plan safe flight times by leaving a healthy 20% capacity reserve to protect and prolong your LiPo battery life.',
      icon: Battery,
      color: 'from-emerald-500 to-teal-600',
      badge: 'Autonomy'
    }
  ];

  const tips = [
    "A slightly forward Center of Gravity (CG - nose heavy) makes the airplane more stable but less maneuverable. A rearward CG (tail heavy) makes it highly unstable and dangerous to fly.",
    "For brushless motor setups, the golden rule is 150 Watts per pound of aircraft weight for trainer flying, 200W/lb for Sport aerobatics, and over 250W/lb for extreme 3D flying.",
    "Never discharge your LiPo batteries below 3.3V per cell under load (or 3.7V resting). Resting at an 80% discharge level is the safe limit to maximize lifespan.",
    "Metal-geared servos are indispensable on large control surfaces or 3D aerobatic planes due to the extreme deflection forces encountered in flight."
  ];

  // Pick a random tip or cycle them. Let's show a couple of interesting facts in a list.
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-aero-navy via-slate-900 to-aero-cobalt text-white p-6 md:p-10 shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
          <svg className="w-full h-full text-white" viewBox="0 0 100 100" preserveAspectRatio="none" fill="currentColor">
            <path d="M0 0 L100 0 L100 100 Z" />
          </svg>
        </div>
        
        {/* Dynamic decorative airplane contour */}
        <div className="absolute right-12 bottom-0 w-80 h-80 text-aero-sky/15 hidden lg:block pointer-events-none">
          <Plane className="w-full h-full rotate-45 transform translate-y-12 translate-x-12" strokeWidth={0.5} />
        </div>

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-aero-cobalt/40 border border-aero-sky/30 px-3 py-1 rounded-full text-xs text-aero-sky font-semibold tracking-wide">
            <Compass className="h-4 w-4 text-aero-sky" />
            <span>OFFICIAL TECHNICAL UTILITIES</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight m-0 text-white">
            Hangar Utilities <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-aero-sky to-white bg-clip-text text-transparent">CORCS Club</span>
          </h1>
          <p className="text-sm md:text-base text-slate-300 font-light leading-relaxed max-w-xl">
            Welcome to the technical computation center for aeromodelling pilots. This application brings together the key engineering calculators to optimize flight performance and guarantee the safety of your aircraft.
          </p>
        </div>
      </div>

      {/* METRICS / LIVE CLUB CONDITIONS BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-sky-50 rounded-xl text-aero-cobalt">
            <Wind className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Estimated Wind</span>
            <span className="text-lg font-bold text-slate-800">12 km/h NE</span>
            <span className="text-[10px] text-green-500 font-semibold block mt-0.5">Optimal conditions</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <Thermometer className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Field Temperature</span>
            <span className="text-lg font-bold text-slate-800">24°C</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Clear sky</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-red-50 rounded-xl text-red-600">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Flight Safety</span>
            <span className="text-lg font-bold text-slate-800">Active Checklist</span>
            <span className="text-[10px] text-red-500 font-semibold block mt-0.5">Verify CG and batteries!</span>
          </div>
        </div>
      </div>

      {/* QUICK NAV TOOLS GRID */}
      <div className="space-y-4">
        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Technical Toolbox</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div 
                key={tool.id}
                onClick={() => setActiveTab(tool.id)}
                className="group relative bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
              >
                {/* Accent glow on hover */}
                <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${tool.color} rounded-l-2xl`}></div>
                
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className={`p-3 bg-gradient-to-br ${tool.color} text-white rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase bg-slate-100 px-2 py-1 rounded-md">
                      {tool.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-aero-cobalt transition-colors duration-200">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-slate-500 font-light mt-1.5 leading-relaxed">
                      {tool.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center text-sm font-semibold text-aero-cobalt group-hover:translate-x-1.5 transition-transform duration-300">
                  Open calculator →
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DIDACTIC TECHNICAL INFO / TIPS */}
      <div className="bg-slate-100 rounded-2xl p-6 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-inner">
        <div className="flex items-start space-x-3.5 max-w-3xl">
          <div className="p-2 bg-aero-navy text-white rounded-lg shrink-0 mt-0.5">
            <AlertCircle className="h-5 w-5 text-aero-sky" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 leading-snug">Hangar Technical Tip</h4>
            <div className="text-sm text-slate-600 font-light mt-1 leading-relaxed">
              <ul className="list-disc pl-4 space-y-2">
                {tips.map((tip, idx) => (
                  <li key={idx} className="marker:text-aero-cobalt">{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
