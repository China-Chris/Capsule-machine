import React, { useState, useEffect } from 'react'
import { useCapsuleMachine } from '../contexts/CapsuleMachineContext'

function CapsuleMachine() {
  const { videoRef, isPlaying, playAnimation } = useCapsuleMachine()
  const containerRef = React.useRef(null)
  const [isMobile, setIsMobile] = useState(false)
  const [showImage, setShowImage] = useState(true)

  useEffect(() => {
    // 检测是否是移动端
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    // 移动端：播放时隐藏图片，显示视频
    if (isMobile && isPlaying) {
      setShowImage(false)
    }
  }, [isMobile, isPlaying])

  const handleClick = (e) => {
    if (isMobile && showImage) {
      // 移动端点击图片时，隐藏图片并播放视频
      setShowImage(false)
      playAnimation()
    } else if (!isMobile) {
      // 桌面端直接播放
      if (e.target !== videoRef.current) {
        playAnimation()
      }
    }
  }

  return (
    <div className="capsule-machine-container">
      <div 
        className="capsule-machine-wrapper" 
        ref={containerRef}
        onClick={handleClick}
        style={{ pointerEvents: isPlaying ? 'none' : 'auto' }}
      >
        {/* 移动端：先显示图片 */}
        {isMobile && showImage && (
          <img
            src="/niudanji.png"
            alt="扭蛋机"
            className="capsule-machine-image"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setShowImage(false)
              playAnimation()
            }}
          />
        )}
        <video
          ref={videoRef}
          className={`capsule-machine-video ${isMobile && showImage ? 'hidden' : ''}`}
          preload="auto"
          playsInline
          muted
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            playAnimation()
          }}
        >
          <source src="/niudanji.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  )
}

export default CapsuleMachine

