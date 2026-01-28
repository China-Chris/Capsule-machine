import React, { useState, useEffect } from 'react'
import { CapsuleMachineProvider, useCapsuleMachine } from './contexts/CapsuleMachineContext'
import Header from './components/Header'
import MainContent from './components/MainContent'
import BackgroundLayer from './components/BackgroundLayer'
import SecondVideo from './components/SecondVideo'

function AppContent() {
  const { showSecondVideo, isTransitioning } = useCapsuleMachine()
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    // 只在移动端启用滚动隐藏功能
    const isMobile = window.innerWidth <= 640
    if (!isMobile) return

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // 在页面顶部时始终显示
      if (currentScrollY <= 10) {
        setIsHeaderVisible(true)
      } else {
        // 向下滚动时隐藏，向上滚动时显示
        if (currentScrollY > lastScrollY) {
          // 向下滚动时隐藏
          setIsHeaderVisible(false)
        } else if (currentScrollY < lastScrollY) {
          // 向上滚动时显示
          setIsHeaderVisible(true)
        }
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <>
      <BackgroundLayer />
      <div 
        className={`header-wrapper ${showSecondVideo ? 'hidden' : ''} ${isTransitioning ? 'fade-out' : ''} ${!isHeaderVisible ? 'scroll-hidden' : ''}`}
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

