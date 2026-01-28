import React from 'react'
import { useCapsuleMachine } from '../contexts/CapsuleMachineContext'

function SecondVideo() {
  const { secondVideoRef, replaySecondVideo } = useCapsuleMachine()

  return (
    <main className="main-content second-video-content">
      <div 
        className="second-video-container"
        onMouseEnter={replaySecondVideo}
      >
        <video
          ref={secondVideoRef}
          className="second-video"
          preload="auto"
          playsInline
        >
          <source src="/dakainiudan.mp4" type="video/mp4" />
        </video>
      </div>
    </main>
  )
}

export default SecondVideo

