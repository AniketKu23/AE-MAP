import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import { WhyItMatters, Pipeline, Comparison, InteractiveDemo } from './components/HomeContent';
import { Rigorous, CaseStudy, UseCases, Metrics } from './components/DetailsContent';
import { DataCredibility, JargonBuster, AboutAndRoadmap, TechStack } from './components/InfoContent';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-teal-200">
      <Navbar />
      <main>
        <Hero />
        <WhyItMatters />
        <Pipeline />
        <InteractiveDemo />
        <Comparison />
        <Rigorous />
        <CaseStudy />
        <UseCases />
        <Metrics />
        <DataCredibility />
        <JargonBuster />

        <AboutAndRoadmap />
        <TechStack />
      </main>
      <Footer />
    </div>
  );
}

export default App;
