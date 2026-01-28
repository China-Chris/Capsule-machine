import React, { useState, useEffect } from 'react'
import { useCapsuleMachine } from '../contexts/CapsuleMachineContext'

function CapsuleMachine() {
  const { videoRef, isPlaying, playAnimation } = useCapsuleMachine()
  const containerRef = React.useRef(null)
  const [isMobile, setIsMobile] = useState(false)
  const [showImage, setShowImage] = useState(true)
  const [videoReady, setVideoReady] = useState(false)

  useEffect(() => {
    // 检测是否是移动端
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 监听视频加载状态，确保未播放时在第一帧（或最后一帧如果已播放过）
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const setToCorrectFrame = () => {
      // 只在视频未播放时设置帧位置
      if (!isPlaying && video.readyState >= 1) {
        // 如果视频已经播放过，停在最后一帧；否则显示第一帧
        // 注意：这里我们依赖 Context 中的 hasPlayedOnce 状态
        // 但由于无法直接访问，我们通过检查 currentTime 来判断
        // 如果 currentTime 接近 duration，说明已经播放完成
        if (video.duration && video.currentTime > video.duration - 0.1) {
          // 已经在最后一帧，保持
          video.currentTime = video.duration
        } else if (video.currentTime > 0.1) {
          // 不在第一帧也不在最后一帧，可能是播放中，不处理
          return
        } else {
          // 在第一帧或接近第一帧
          video.currentTime = 0
        }
        video.pause()
      }
    }

    const handleCanPlay = () => {
      // 确保视频可以播放
      if (video.readyState >= 2 && !isPlaying) {
        setToCorrectFrame()
        setVideoReady(true)
      }
    }

    // 如果视频已经加载好，立即设置（只在未播放时）
    if (video.readyState >= 2 && !isPlaying) {
      setToCorrectFrame()
      setVideoReady(true)
    }

    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('loadeddata', handleCanPlay)

    return () => {
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('loadeddata', handleCanPlay)
    }
  }, [isPlaying])

  useEffect(() => {
    // 移动端：播放时开始淡出图片，淡入视频
    if (isMobile && isPlaying) {
      // 延迟一点确保视频第一帧已显示
      requestAnimationFrame(() => {
        setShowImage(false)
      })
    }
  }, [isMobile, isPlaying])

  // 移动端：当图片隐藏、显示视频时，确保视频在正确帧（仅在未播放时）
  useEffect(() => {
    if (isMobile && !showImage && !isPlaying) {
      const video = videoRef.current
      if (video && video.readyState >= 1) {
        // 如果视频已经播放过（接近最后一帧），保持在最后一帧；否则在第一帧
        if (video.duration && video.currentTime > video.duration - 0.1) {
          video.currentTime = video.duration
        } else {
          video.currentTime = 0
        }
        video.pause()
        // 清理内联样式，恢复 CSS 控制
        video.style.opacity = ''
        video.style.zIndex = ''
      }
    }
  }, [isMobile, showImage, isPlaying])

  return (
    <div className="capsule-machine-container">
      <div 
        className="capsule-machine-wrapper" 
        ref={containerRef}
        onClick={(e) => {
          // 桌面端点击容器时播放
          if (!isMobile && e.target !== videoRef.current) {
            playAnimation()
          }
        }}
        style={{ pointerEvents: isPlaying ? 'none' : 'auto' }}
      >
        {/* 移动端：先显示图片 */}
        {isMobile && (
          <img
            src="/niudanji.png"
            alt="扭蛋机"
            className={`capsule-machine-image ${showImage ? '' : 'fade-out'}`}
            onTouchStart={async (e) => {
              // 移动端使用 touchstart 事件，响应更快
              e.preventDefault()
              e.stopPropagation()
              
              // 防止重复点击
              if (!showImage || isPlaying) {
                return
              }
              
              const video = videoRef.current
              if (!video) {
                console.error('视频元素未找到')
                return
              }
              
              console.log('点击图片，准备播放视频，视频状态:', {
                readyState: video.readyState,
                paused: video.paused,
                muted: video.muted
              })
              
              try {
                // 如果视频还没加载好，等待一下
                if (video.readyState < 2) {
                  await new Promise((resolve) => {
                    const handleCanPlay = () => {
                      video.removeEventListener('canplay', handleCanPlay)
                      resolve()
                    }
                    video.addEventListener('canplay', handleCanPlay)
                    // 超时保护
                    setTimeout(() => {
                      video.removeEventListener('canplay', handleCanPlay)
                      resolve()
                    }, 2000)
                  })
                }
                
                // 确保视频在第一帧
                video.currentTime = 0
                video.pause()
                video.muted = false
                
                // 等待多帧确保视频第一帧完全渲染
                await new Promise(resolve => requestAnimationFrame(resolve))
                await new Promise(resolve => requestAnimationFrame(resolve))
                
                // 先让视频显示第一帧（opacity: 1），但不移除 behind-image 类
                // 这样视频已经在图片后面准备好了
                video.style.opacity = '1'
                video.style.zIndex = '10'
                
                // 再等待一帧确保样式已应用
                await new Promise(resolve => requestAnimationFrame(resolve))
                
                // 现在开始交叉淡入淡出：图片淡出，视频已经在显示
                setShowImage(false)
                
                // 立即开始播放视频
                playAnimation()
              } catch (error) {
                console.error('播放视频时出错:', error)
              }
            }}
            onClick={async (e) => {
              // 保留 onClick 作为备用
              e.preventDefault()
              e.stopPropagation()
              
              // 防止重复点击
              if (!showImage || isPlaying) {
                return
              }
              
              const video = videoRef.current
              if (!video) {
                return
              }
              
              try {
                video.currentTime = 0
                video.pause()
                video.muted = false
                
                // 等待一帧确保视频第一帧已渲染
                requestAnimationFrame(() => {
                  // 开始交叉淡入淡出
                  setShowImage(false)
                  playAnimation()
                })
              } catch (error) {
                console.error('播放视频时出错:', error)
              }
            }}
          />
        )}
        <video
          ref={videoRef}
          className={`capsule-machine-video ${isMobile && showImage ? 'behind-image' : ''}`}
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

