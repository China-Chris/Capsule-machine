import React, { useEffect, useState, useMemo, useRef } from 'react'

function PrizeModal({ isOpen, onClose }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showProof, setShowProof] = useState(false)
  const printerAudioRef = useRef(null) // 打印机音频引用
  
  // 生成唯一的凭证码
  const proofCode = useMemo(() => {
    return Math.random().toString(36).substring(2, 10).toUpperCase()
  }, [isOpen])
  
  // 生成zkProof内容
  const zkProofContent = useMemo(() => {
    // 生成一个类似哈希值的zkProof字符串
    const hash1 = Math.random().toString(36).substring(2, 18)
    const hash2 = Math.random().toString(36).substring(2, 18)
    return `${hash1}${hash2}`.toUpperCase().match(/.{1,8}/g)?.join(' ') || ''
  }, [isOpen])

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
    if (isOpen) {
      // 延迟一点显示，触发动画
      setTimeout(() => {
        setIsVisible(true)
      }, 10)
      // 重置奖券状态
      setShowProof(false)
    } else {
      setIsVisible(false)
      setShowProof(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* 遮罩层 */}
      <div 
        className={`prize-modal-overlay ${isVisible ? 'visible' : ''}`}
        onClick={onClose}
      />
      
      {/* 弹窗内容 */}
      <div className={`prize-modal ${isMobile ? 'mobile' : 'desktop'} ${isVisible ? 'visible' : ''}`}>
        <div className="prize-modal-content">
          <button 
            className="prize-modal-close"
            onClick={onClose}
            aria-label="关闭"
          >
            ×
          </button>
          
          <div className="prize-modal-body">
            <h2 className="prize-title">🎉 恭喜中奖！</h2>
            <div className="prize-image-container">
              <img 
                src="/G99sxyEawAAmIKD.jpg" 
                alt="中奖奖品" 
                className="prize-image"
              />
            </div>
            <div className="prize-info">
              <p className="prize-description">网球x1</p>
            </div>
            <button 
              className="prize-proof-button"
              onClick={() => {
                // 播放打印机音频
                const audio = printerAudioRef.current
                if (audio) {
                  audio.currentTime = 0
                  audio.play().catch(error => {
                    console.error('打印机音频播放失败:', error)
                  })
                }
                // 显示奖券
                setShowProof(true)
              }}
            >
              生成poof证明
            </button>
          </div>
        </div>
        
        {/* 打印机出纸口效果 */}
        {showProof && (
          <div className="printer-slot">
            <div className="printer-slot-line"></div>
          </div>
        )}
        
        {/* 奖券 - 收据打印效果 */}
        <div className={`prize-proof-ticket ${showProof ? 'show' : ''}`}>
          <div className="proof-ticket-content">
            <div className="proof-ticket-header">
              <h3>ZK Proof</h3>
            </div>
            <div className="proof-ticket-body">
              <div className="proof-ticket-info">
                <p className="proof-prize-name">{zkProofContent}</p>
              </div>
            </div>
            {/* 收据底部虚线 */}
            <div className="proof-ticket-footer">
              <div className="ticket-tear-line"></div>
            </div>
          </div>
        </div>
        
        {/* 打印机音频 */}
        <audio
          ref={printerAudioRef}
          preload="auto"
        >
          <source src="/dayinji.mp3" type="audio/mpeg" />
        </audio>
      </div>
    </>
  )
}

export default PrizeModal

