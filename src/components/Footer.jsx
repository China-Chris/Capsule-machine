import React from 'react'
import { useCapsuleMachine } from '../contexts/CapsuleMachineContext'

function Footer() {
  const { playAnimation, isPlaying } = useCapsuleMachine()

  return (
    <footer className="footer">
      <button 
        className="cta-button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          playAnimation()
        }}
        style={{ pointerEvents: isPlaying ? 'none' : 'auto' }}
      >
        <span className="cta-text-chinese">参加扭蛋机抽奖活动</span>
        <span className="cta-text-english">Enter the egg twister raffle</span>
      </button>
    </footer>
  )
}

export default Footer

