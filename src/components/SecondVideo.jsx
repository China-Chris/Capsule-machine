import React, { useState, useRef, useEffect } from 'react'
import { useCapsuleMachine } from '../contexts/CapsuleMachineContext'

function SecondVideo() {
  const { secondVideoRef, replaySecondVideo } = useCapsuleMachine()
  const [showSecondVideo, setShowSecondVideo] = useState(false)
  const secondVideoRef2 = useRef(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // 检测是否是移动端
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 震动函数 - 兼容 iOS 和 Android
  const vibrate = React.useCallback((pattern) => {
    if (!isMobile) return
    
    // iOS 设备检测
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)
    
    try {
      // 标准震动 API（Android 和部分 iOS）
      if (navigator.vibrate) {
        navigator.vibrate(pattern)
      } 
      // iOS 特殊处理：使用 AudioContext 触发震动（需要用户交互）
      else if (isIOS && window.AudioContext) {
        // iOS 上，震动通常需要用户交互才能触发
        // 这里我们尝试使用 navigator.vibrate，如果不可用则跳过
        // iOS 13+ 支持 navigator.vibrate，但需要用户交互
        console.log('iOS 设备：震动功能需要用户交互')
      }
    } catch (error) {
      console.log('震动功能不可用:', error)
    }
  }, [isMobile])

  const handleVideoClick = () => {
    // 如果第一个视频正在显示，切换到第二个视频
    if (!showSecondVideo) {
      // 暂停第一个视频
      if (secondVideoRef.current) {
        secondVideoRef.current.pause()
      }
      
      // iOS 需要在用户交互中直接调用震动（不能延迟）
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)
      if (isMobile && navigator.vibrate) {
        try {
          // 在用户点击事件中直接触发震动（iOS 需要）
          navigator.vibrate(30)
        } catch (error) {
          console.log('震动功能不可用:', error)
        }
      }
      
      // 切换到第二个视频
      setShowSecondVideo(true)
      const video2 = secondVideoRef2.current
      if (video2) {
        video2.currentTime = 0
        video2.muted = false
        
        video2.play().catch(error => {
          console.error('第二个视频播放失败:', error)
        })
      }
    }
  }

  // 监听第二个视频的播放事件，在移动端触发震动
  useEffect(() => {
    const video2 = secondVideoRef2.current
    if (!video2 || !isMobile) return

    const handlePlay = () => {
      // 视频开始播放时触发轻微震动
      // 轻微震动：短震-暂停-短震（柔和效果）
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)
      
      try {
        // iOS 13+ 支持 navigator.vibrate，但必须在用户交互中调用
        // 由于这是在 play 事件中（异步），iOS 可能不支持
        // 所以我们只在 Android 上使用，iOS 的震动在点击时已经触发
        if (navigator.vibrate && !isIOS) {
          // Android: 轻微震动模式
          navigator.vibrate([30, 100, 30])
        } else if (navigator.vibrate && isIOS) {
          // iOS: 尝试触发，但可能不会工作（因为不在用户交互中）
          // iOS 的震动主要在点击时触发
          navigator.vibrate([30, 100, 30])
        }
      } catch (error) {
        console.log('震动功能不可用:', error)
      }
    }

    video2.addEventListener('play', handlePlay)

    return () => {
      video2.removeEventListener('play', handlePlay)
    }
  }, [isMobile, showSecondVideo])

  return (
    <main className="main-content second-video-content">
      <div 
        className="second-video-container"
        onMouseEnter={replaySecondVideo}
      >
        {/* 第一个视频 - dakainiudan.mp4 */}
        <video
          ref={secondVideoRef}
          className={`second-video ${showSecondVideo ? 'hidden' : ''}`}
          preload="auto"
          playsInline
          onClick={handleVideoClick}
        >
          <source src="/dakainiudan.mp4" type="video/mp4" />
        </video>
        
        {/* 第二个视频 - dakainiudan2.mp4 */}
        <video
          ref={secondVideoRef2}
          className={`second-video ${showSecondVideo ? '' : 'hidden'}`}
          preload="auto"
          playsInline
        >
          <source src="/dakainiudan2.mp4" type="video/mp4" />
        </video>
      </div>
    </main>
  )
}

export default SecondVideo

