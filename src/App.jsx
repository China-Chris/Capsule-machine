import React from 'react'
import { CapsuleMachineProvider, useCapsuleMachine } from './contexts/CapsuleMachineContext'
import Header from './components/Header'
import MainContent from './components/MainContent'
import BackgroundLayer from './components/BackgroundLayer'
import SecondVideo from './components/SecondVideo'

function AppContent() {
  const { showSecondVideo, isTransitioning } = useCapsuleMachine()

  return (
    <>
      <BackgroundLayer />
      <div 
        className={`header-wrapper ${showSecondVideo ? 'hidden' : ''} ${isTransitioning ? 'fade-out' : ''}`}
      >
        <Header />
      </div>
      <div 
        className={`content-wrapper ${isTransitioning ? 'fade-out' : ''} ${showSecondVideo ? 'fade-in' : ''}`}
      >
        {showSecondVideo ? <SecondVideo /> : <MainContent />}
      </div>
    </>
  )
}

function App() {
  return (
    <CapsuleMachineProvider>
      <AppContent />
    </CapsuleMachineProvider>
  )
}

export default App

