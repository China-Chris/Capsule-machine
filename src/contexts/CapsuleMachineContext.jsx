import React, { createContext, useContext, useRef, useState, useEffect, useCallback } from 'react'

const CapsuleMachineContext = createContext()

export const useCapsuleMachine = () => {
  const context = useContext(CapsuleMachineContext)
  if (!context) {
    throw new Error('useCapsuleMachine must be used within CapsuleMachineProvider')
  }
  return context
}

export const CapsuleMachineProvider = ({ children }) => {
  const videoRef = useRef(null)
  const secondVideoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [showSecondVideo, setShowSecondVideo] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false)

  // 播放扭蛋机动画
  const playAnimation = useCallback(() => {
    if (isPlaying || !videoRef.current) {
      return
    }

    console.log('开始播放视频')
    setIsPlaying(true)

    const video = videoRef.current
    
    // 重置到开头并取消静音
    video.currentTime = 0
    video.muted = false

    // 使用 Promise 处理播放
    const playPromise = video.play()

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('视频播放成功')
        })
        .catch(error => {
          console.error('视频播放失败:', error)
          setIsPlaying(false)
        })
    }
  }, [isPlaying])

  // 视频播放结束后的处理
  const handleVideoEnd = () => {
    console.log('第一个视频播放结束')
    const video = videoRef.current
    if (video) {
      // 确保视频停在最后一帧
      video.pause()
      // 设置到视频的最后一帧（duration 可能略有误差，使用 seeked 事件确保）
      if (video.duration) {
        video.currentTime = video.duration
        // 确保停在最后一帧
        video.addEventListener('seeked', function onSeeked() {
          video.pause()
          video.removeEventListener('seeked', onSeeked)
        }, { once: true })
      }
    }
    
    setIsPlaying(false)
    setHasPlayedOnce(true)
    
    // 等待一段时间后开始过渡
    setTimeout(() => {
      console.log('开始过渡到第二个视频')
      setIsTransitioning(true)
      
      // 同时开始淡出第一个内容，并准备显示第二个内容
      setTimeout(() => {
        setShowSecondVideo(true)
        // 等待第二个内容淡入完成后再清除过渡状态
        setTimeout(() => {
          setIsTransitioning(false)
        }, 100)
      }, 300) // 300ms后切换内容，让淡出和淡入有重叠
    }, 500) // 等待500毫秒
  }

  // 视频加载错误处理
  const handleVideoError = () => {
    console.error('视频加载失败')
    setIsPlaying(false)
  }

  // 初始化视频（显示第一帧）
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const initVideo = () => {
      if (isInitialized || isPlaying) return

      // 移动端可能需要 readyState >= 1 (HAVE_METADATA) 就可以显示第一帧
      if (video.readyState >= 1) {
        // 如果视频已经播放过，停在最后一帧；否则显示第一帧
        if (hasPlayedOnce && video.duration) {
          video.currentTime = video.duration
        } else {
          video.currentTime = 0
        }
        video.pause()
        // 确保视频是静音的，这样在移动端才能正常加载和显示
        video.muted = true
        setIsInitialized(true)
        console.log('视频已初始化，显示', hasPlayedOnce ? '最后一帧' : '第一帧', 'readyState:', video.readyState)
      }
    }

    const handleLoadedMetadata = () => {
      if (!isInitialized) {
        console.log('视频元数据加载完成')
        initVideo()
      }
    }

    const handleLoadedData = () => {
      if (!isInitialized) {
        console.log('视频数据加载完成')
        initVideo()
      }
    }

    const handleCanPlay = () => {
      if (!isInitialized) {
        console.log('视频可以播放')
        initVideo()
      }
    }

    // 添加多个事件监听以确保在移动端也能正确初始化
    video.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true })
    video.addEventListener('loadeddata', handleLoadedData, { once: true })
    video.addEventListener('canplay', handleCanPlay, { once: true })
    video.addEventListener('ended', handleVideoEnd)
    video.addEventListener('error', handleVideoError)

    // 立即尝试初始化（如果视频已经加载）
    initVideo()

    // 延迟初始化（作为备用）
    const timeoutId = setTimeout(() => {
      initVideo()
    }, 300)

    return () => {
      clearTimeout(timeoutId)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('ended', handleVideoEnd)
      video.removeEventListener('error', handleVideoError)
    }
  }, [isInitialized, isPlaying, hasPlayedOnce])

  // 键盘支持
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === ' ' || e.key === 'Enter') && !isPlaying) {
        e.preventDefault()
        playAnimation()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isPlaying, playAnimation])

  // 重新播放第二个视频
  const replaySecondVideo = useCallback(() => {
    const secondVideo = secondVideoRef.current
    if (!secondVideo) return
    
    console.log('重新播放第二个视频')
    secondVideo.currentTime = 0
    secondVideo.muted = false
    secondVideo.play().catch(error => {
      console.error('第二个视频重新播放失败:', error)
    })
  }, [])

  // 第二个视频播放结束后的处理 - 每隔25秒重新播放
  const handleSecondVideoEnd = useCallback(() => {
    console.log('第二个视频播放结束，等待25秒后重新播放')
    
    // 等待25秒（25000毫秒）后重新播放
    setTimeout(() => {
      replaySecondVideo()
    }, 25000) // 25秒 = 25000毫秒
  }, [replaySecondVideo])

  // 当切换到第二个视频时，自动播放
  useEffect(() => {
    if (!showSecondVideo) return

    const secondVideo = secondVideoRef.current
    if (!secondVideo) return

    // 等待一小段时间确保视频元素已渲染
    const timer = setTimeout(() => {
      secondVideo.currentTime = 0
      secondVideo.muted = false
      secondVideo.play().catch(error => {
        console.error('第二个视频播放失败:', error)
      })
    }, 100)

    secondVideo.addEventListener('ended', handleSecondVideoEnd)
    
    return () => {
      clearTimeout(timer)
      secondVideo.removeEventListener('ended', handleSecondVideoEnd)
    }
  }, [showSecondVideo, handleSecondVideoEnd])

  const value = {
    videoRef,
    secondVideoRef,
    isPlaying,
    showSecondVideo,
    isTransitioning,
    playAnimation,
    replaySecondVideo
  }

  return (
    <CapsuleMachineContext.Provider value={value}>
      {children}
    </CapsuleMachineContext.Provider>
  )
}

