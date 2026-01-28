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

  // 震动函数
  const vibrate = React.useCallback((pattern) => {
    if (isMobile && navigator.vibrate) {
      try {
        navigator.vibrate(pattern)
      } catch (error) {
        console.log('震动功能不可用:', error)
      }
    }
  }, [isMobile])

  const handleVideoClick = () => {
    // 如果第一个视频正在显示，切换到第二个视频
    if (!showSecondVideo) {
      // 暂停第一个视频
      if (secondVideoRef.current) {
        secondVideoRef.current.pause()
      }
      
      // 切换到第二个视频
      setShowSecondVideo(true)
      const video2 = secondVideoRef2.current
      if (video2) {
        video2.currentTime = 0
        video2.muted = false
        
        // 移动端：播放前触发震动
        if (isMobile) {
          // 短震动提示开始播放
          vibrate(100)
        }
        
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
      // 视频开始播放时触发震动
      // 模式：短震-暂停-短震-暂停-短震（类似心跳效果）
      if (navigator.vibrate) {
        try {
          navigator.vibrate([100, 50, 100, 50, 100])
        } catch (error) {
          console.log('震动功能不可用:', error)
        }
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

