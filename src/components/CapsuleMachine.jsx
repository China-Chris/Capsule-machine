import React from 'react'
import { useCapsuleMachine } from '../contexts/CapsuleMachineContext'

function CapsuleMachine() {
  const { videoRef, isPlaying, playAnimation } = useCapsuleMachine()
  const containerRef = React.useRef(null)

  return (
    <div className="capsule-machine-container">
      <div 
        className="capsule-machine-wrapper" 
        ref={containerRef}
        onClick={(e) => {
          if (e.target !== videoRef.current) {
            playAnimation()
          }
        }}
        style={{ pointerEvents: isPlaying ? 'none' : 'auto' }}
      >
        <video
          ref={videoRef}
          className="capsule-machine-video"
          preload="auto"
          playsInline
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

