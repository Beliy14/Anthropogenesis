import React from "react"
import { countBorder } from "../../consts"
import "./levelBar.css"

const LevelBar = ({ level, levelCount, gameEng }) => {
  const maxCount = countBorder[level]
  const percentage = (levelCount / maxCount) * 100

  console.log(gameEng)

  return (
    <div className="levelBarBLock">
      <span className="count">{levelCount}</span>
      {!gameEng && (
        <>
          <div className="levelBar">
            <div className="levelBarFill" style={{ width: `${percentage}%` }}></div>
          </div>
          <span className="count">{maxCount}</span>
        </>
      )}
    </div>
  )
}

export default LevelBar
