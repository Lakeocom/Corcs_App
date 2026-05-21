import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import MotorConverter from './components/MotorConverter';
import ServoAssistant from './components/ServoAssistant';
import CGCalculator from './components/CGCalculator';
import FlightCalculator from './components/FlightCalculator';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Render active module component dynamically
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'motor':
        return <MotorConverter />;
      case 'servo':
        return <ServoAssistant />;
      case 'cg':
        return <CGCalculator />;
      case 'flight':
        return <FlightCalculator />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}
