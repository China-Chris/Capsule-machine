import React, { useState, useEffect, useRef } from 'react'
import { CapsuleMachineProvider, useCapsuleMachine } from './contexts/CapsuleMachineContext'
import Header from './components/Header'
import MainContent from './components/MainContent'
import BackgroundLayer from './components/BackgroundLayer'
import SecondVideo from './components/SecondVideo'

function AppContent() {
  const { showSecondVideo, isTransitioning } = useCapsuleMachine()
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const scrollPositionRef = useRef(0)

  // 禁止滚动功能：当第二个视频显示时
  useEffect(() => {
    if (showSecondVideo) {
      // 保存当前滚动位置
      scrollPositionRef.current = window.scrollY || document.documentElement.scrollTop
      
      // 禁止滚动：隐藏滚动条并固定页面位置
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollPositionRef.current}px`
      document.body.style.width = '100%'
      
      // 同时处理 html 元素（某些浏览器需要）
      document.documentElement.style.overflow = 'hidden'
      
      console.log('禁止滚动，保存位置:', scrollPositionRef.current)
    } else {
      // 恢复滚动
      const savedPosition = scrollPositionRef.current
      
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.documentElement.style.overflow = ''
      
      // 恢复滚动位置（使用 requestAnimationFrame 确保样式已应用）
      requestAnimationFrame(() => {
        window.scrollTo(0, savedPosition)
      })
      
      console.log('恢复滚动，位置:', savedPosition)
    }

    return () => {
      // 清理：组件卸载时恢复滚动
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.documentElement.style.overflow = ''
    }
  }, [showSecondVideo])

  useEffect(() => {
    // 只在移动端启用滚动隐藏功能
    const isMobile = window.innerWidth <= 640
    if (!isMobile) return

    const handleScroll = (e) => {
      // 如果第二个视频正在显示，完全阻止滚动
      if (showSecondVideo) {
        e.preventDefault()
        window.scrollTo(0, scrollPositionRef.current)
        return false
      }

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

    const handleTouchMove = (e) => {
      // 如果第二个视频正在显示，阻止触摸滚动
      if (showSecondVideo) {
        e.preventDefault()
      }
    }

    // 使用 passive: false 以便可以阻止默认行为
    window.addEventListener('scroll', handleScroll, { passive: false })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [lastScrollY, showSecondVideo])

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

