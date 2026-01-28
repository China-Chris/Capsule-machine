import React, { useEffect, useState } from 'react'

function PrizeModal({ isOpen, onClose }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

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
    } else {
      setIsVisible(false)
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
                // 生成poof证明的逻辑
                console.log('生成poof证明')
              }}
            >
              生成poof证明
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default PrizeModal

