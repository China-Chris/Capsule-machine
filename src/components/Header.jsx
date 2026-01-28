import React from 'react'

function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="title">
          <span className="title-text">喜乐贩卖机</span>
          <span className="title-dot">●</span>
        </h1>
      </div>
      <div className="header-right">
        <div className="status-badge">限时扭蛋</div>
        <div className="date-range">4/20 - 4/23</div>
      </div>
    </header>
  )
}

export default Header

