import React from 'react'
import LeftContent from './LeftContent'
import CapsuleMachine from './CapsuleMachine'
import RightContent from './RightContent'

function MainContent() {
  return (
    <main className="main-content">
      <LeftContent />
      <CapsuleMachine />
      <RightContent />
    </main>
  )
}

export default MainContent

