import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Hero from './components/Hero/Hero';
import HowItWorks from './components/HowItWorks/HowItWorks';
import Agents from './components/Agents/Agents';
import CTA from './components/CTA/CTA';
import FAQ from './components/FAQ/FAQ';
import AgentOptionsWithAnimation from './components/AgentOptionsWithAnimation/AgentOptionsWithAnimation';
import GameTrailer from './components/GameTrailer/GameTrailer';
import ImageGallery from './components/ImageGallery/ImageGallery';
import Community from './components/Community/Community';
import Skills from './components/Skills/Skills';
import GamePageType1 from './components/GamePageType1/GamePageType1';
import GamePageType2 from './components/GamePageType2/GamePageType2';
import Navbar from './components/Navbar/Navbar';
import OnboardingFlow from './components/Onboarding/OnboardingFlow.jsx';
import Tracking from './components/Dashboard/Tracking.jsx';
import Controls from './components/Dashboard/Controls.jsx';
import DashboardCommunity from './components/Dashboard/Community.jsx';
import Store from './components/Dashboard/Store.jsx';
import Reports from './components/Dashboard/Reports.jsx';
import MobileInput from './components/Onboarding/MobileInput.jsx';
import { OnboardingProvider, useOnboarding } from './context/OnboardingContext';
import GameScene from './components/GameScene/GameScene.jsx';
import ImpersonationGame from './components/ImpersonationGame/ImpersonationGame.jsx'
import Game from './components/Game/Game.jsx';
import './App.css';

function AppRoutes() {
  const { hasValidOnboardingData, hasMobileNumber } = useOnboarding();

  const getParentRedirect = () => {
    if (!hasMobileNumber()) {
      return <Navigate to="/parent/mobile" />;
    }
    if (hasMobileNumber() && !hasValidOnboardingData()) {
      return <Navigate to="/parent" />;
    }
    return <Navigate to="/parent/tracking" />;
  };

  return (
    <Routes>
      <Route path="/" element={
        <>
          <Navbar />
          <div className="outline">
            <Hero />
            <HowItWorks />
            {/* <GameTrailer /> */}
            <ImageGallery />
          </div>
          <AgentOptionsWithAnimation />
          <Skills />
          <Community />
          {/*<Agents />*/}
          <CTA />
          {/* <FAQ /> */}
        </>
      } />
      {
        <Route path="/demo" element={<Game />} />
      }
      {
        <Route path="/game_scene" element={<GameScene />} />
      }
      {
        <Route path="/impersonation" element={<ImpersonationGame />} />
      }
      {/*<Route path="/game/planetary-weight" element={<GamePageType1 />} />
      <Route path="/game/wordsconnect" element={<GamePageType2 />} />*/}
      
      {/* Parent Routes */}
      <Route path="/parent/mobile" element={
        hasMobileNumber() ? getParentRedirect() : <MobileInput />
      } />
      <Route path="/parent" element={
        !hasMobileNumber() ? <Navigate to="/parent/mobile" /> : 
        hasValidOnboardingData() ? <Navigate to="/parent/tracking" /> : 
        <OnboardingFlow />
      } />
      <Route path="/parent/tracking" element={
        !hasMobileNumber() ? <Navigate to="/parent/mobile" /> :
        !hasValidOnboardingData() ? <Navigate to="/parent" /> :
        <Tracking />
      } />
      <Route path="/parent/controls" element={
        !hasMobileNumber() ? <Navigate to="/parent/mobile" /> :
        !hasValidOnboardingData() ? <Navigate to="/parent" /> :
        <Controls />
      } />
      <Route path="/parent/community" element={
        !hasMobileNumber() ? <Navigate to="/parent/mobile" /> :
        !hasValidOnboardingData() ? <Navigate to="/parent" /> :
        <DashboardCommunity />
      } />
      <Route path="/parent/store" element={
        !hasMobileNumber() ? <Navigate to="/parent/mobile" /> :
        !hasValidOnboardingData() ? <Navigate to="/parent" /> :
        <Store />
      } />
      <Route path="/parent/reports" element={
        !hasMobileNumber() ? <Navigate to="/parent/mobile" /> :
        !hasValidOnboardingData() ? <Navigate to="/parent" /> :
        <Reports />
      } />
    </Routes>
  );
}

function App() {
  return (
    <OnboardingProvider>
      <div className="App">
        <AppRoutes />
      </div>
    </OnboardingProvider>
  );
}

export default App;
