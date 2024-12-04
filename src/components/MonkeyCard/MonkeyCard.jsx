import React, { useState, useRef } from "react"
import { monkeys } from "../../consts"
import Score from "../Score/Score"
import brainImgSrc from "../../assets/brain.webp"
import "./monkeyCard.css"

const MonkeyCard = ({ level, setLevelCount, levelCount, buster, language, gameEnd }) => {
  const [scores, setScores] = useState([])
  const cardRef = useRef(null)

  const onMonkeyClick = (e) => {
    const card = cardRef.current
    const rect = card.getBoundingClientRect()

    const offsetX = e.clientX - rect.left - rect.width / 2
    const offsetY = e.clientY - rect.top - rect.height / 2

    setLevelCount(levelCount + buster)
    setScores([...scores, { x: e.clientX - rect.left, y: e.clientY - rect.top, score: buster }])

    const tiltX = (offsetY / rect.height) * 20
    const tiltY = (offsetX / rect.width) * -20

    card.style.setProperty("--tiltX", `${tiltX}deg`)
    card.style.setProperty("--tiltY", `${tiltY}deg`)

    setTimeout(() => {
      card.style.setProperty("--tiltX", "0deg")
      card.style.setProperty("--tiltY", "0deg")
    }, 300)
  }

  return (
    <div className="monkey-card" onClick={onMonkeyClick} ref={cardRef}>
      {gameEnd ? (
        <>
          <img src={brainImgSrc} alt={language === "en" ? "Pump your brains out" : "Качай мозги"} className="brain-image" />
          <h4 className="card-name">{language === "en" ? "Don't waste your time on this!" : "Не трать своё время на это!"}</h4>
        </>
      ) : (
        <>
          <img src={monkeys[level]?.img} alt={monkeys[level]?.name[language]} className="monkey-image" />
          <h4 className="card-name">{monkeys[level]?.name[language]}</h4>
        </>
      )}

      {scores.map(({ x, y, score }, index) => (
        <Score key={index} score={score} x={x} y={y} />
      ))}
    </div>
  )
}

export default MonkeyCard
