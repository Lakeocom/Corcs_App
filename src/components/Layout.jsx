import React, { useState } from 'react';
import { Plane, Zap, Gauge, Ruler, Battery, Menu, X, LayoutDashboard, Compass, Wind } from 'lucide-react';

export default function Layout({ children, activeTab, setActiveTab }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, desc: 'Club panel' },
    { id: 'motor', name: 'Motor Converter', icon: Zap, desc: 'Nitro to Electric' },
    { id: 'servo', name: 'Servo Assistant', icon: Gauge, desc: 'Torque calculator' },
    { id: 'cg', name: 'Center of Gravity', icon: Ruler, desc: 'CG calculator' },
    { id: 'flight', name: 'Flight Time', icon: Battery, desc: 'Battery & autonomy' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-800 antialiased font-sans">
      
      {/* MOBILE HEADER */}
      <header className="md:hidden bg-aero-navy text-white px-4 py-3 flex items-center justify-between shadow-md border-b border-slate-800 z-50">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-aero-cobalt rounded-lg">
            <Plane className="h-6 w-6 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-tight text-white m-0 leading-none">CORCS</h1>
            <span className="text-[10px] text-aero-sky tracking-widest font-semibold uppercase">Aeromodelling</span>
          </div>
        </div>
        
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-aero-sky transition-colors"
          aria-label="Open menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* MOBILE SIDEBAR PANEL (Drawer overlay) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="w-72 max-w-[80vw] h-full bg-aero-navy text-white flex flex-col shadow-2xl p-5 border-r border-slate-800 animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-2 bg-aero-cobalt rounded-xl shadow-lg shadow-aero-cobalt/25">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="font-extrabold text-xl tracking-tight text-white m-0">Club CORCS</h2>
                <span className="text-xs text-aero-sky tracking-wider font-semibold uppercase">Flight Utilities</span>
              </div>
            </div>

            <nav className="flex-1 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3.5 px-4 py-3.5 rounded-xl text-left transition-all ${
                      isActive 
                        ? 'bg-aero-cobalt text-white font-semibold shadow-lg shadow-aero-cobalt/20 scale-[1.02]' 
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                    <div>
                      <div className="text-sm font-medium leading-none">{item.name}</div>
                      <span className="text-[10px] text-slate-500 font-normal">{item.desc}</span>
                    </div>
                  </button>
                );
              })}
            </nav>

            <div className="mt-auto border-t border-slate-800 pt-4 text-center">
              <div className="flex items-center justify-center space-x-1.5 text-xs text-slate-500">
                <Compass className="h-4 w-4 text-aero-sky" />
                <span>Assisted Navigation v1.0</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex md:w-72 bg-aero-navy text-white flex-col border-r border-slate-800 shadow-xl z-30 flex-shrink-0">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center space-x-3.5">
          <div className="p-2.5 bg-aero-cobalt rounded-xl shadow-lg shadow-aero-cobalt/20 border border-aero-sky/20">
            <Plane className="h-6 w-6 text-white rotate-45" />
          </div>
          <div>
            <h2 className="font-extrabold text-xl tracking-tight text-white leading-tight">Club CORCS</h2>
            <span className="text-xs text-aero-sky tracking-wider font-semibold uppercase">Hangar Utilities</span>
          </div>
        </div>

        {/* Sidebar Menu Items */}
        <nav className="flex-1 p-4 space-y-1.5 mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl text-left transition-all group ${
                  isActive 
                    ? 'bg-aero-cobalt text-white font-semibold shadow-lg shadow-aero-cobalt/35 scale-[1.01] border-l-4 border-aero-sky' 
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <Icon className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                <div>
                  <div className="text-sm leading-tight font-medium">{item.name}</div>
                  <span className="text-[10px] text-slate-500 font-normal leading-none block mt-0.5 group-hover:text-slate-400 transition-colors">{item.desc}</span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Desktop Sidebar Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/20">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <Wind className="h-4 w-4 text-aero-sky animate-pulse" />
            <span className="font-medium tracking-wide">CORCS Aeromodelling Club</span>
          </div>
          <p className="text-[10px] text-slate-600 mt-1 font-mono">Flight Coordinates: 2026.05</p>
        </div>
      </aside>

      {/* MAIN MAIN CONTENT CONTAINER */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top bar with decorative widgets */}
        <header className="hidden md:flex bg-white border-b border-slate-200 px-8 py-4 items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900 m-0">
              {menuItems.find(i => i.id === activeTab)?.name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {menuItems.find(i => i.id === activeTab)?.desc}
            </p>
          </div>
          
          {/* Aero Status Widget */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-xs bg-slate-100 px-3 py-1.5 rounded-full text-slate-600 border border-slate-200">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-ping"></span>
              <span className="font-semibold text-slate-700">Field Status: Open</span>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Wind: <span className="text-aero-cobalt font-semibold">12 km/h NE</span>
            </div>
          </div>
        </header>

        {/* Dynamic Section Area */}
        <div className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-300">
          {children}
        </div>
      </main>

    </div>
  );
}
