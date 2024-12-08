import React, { useState } from "react"
import { HiLockClosed } from "react-icons/hi"
import { RiCopperCoinLine } from "react-icons/ri"
import { levelsAutoclicker } from "../../../consts"
import "./modalAutoclicker.css"

const ModalAutoclicker = ({ language, levelCount, setLevelCount, autoclickCount, setAutoclickCount }) => {
  const [levelAutoclick, setLevelAutoclick] = useState(Number(localStorage.getItem("levelAutoclick")) ?? 0)

  const buyLevel = (autoclick, price, lvl) => {
    if (autoclickCount <= lvl) {
      const newLevelCount = levelCount - price
      const newLevelAutoclick = levelAutoclick + 1
      setAutoclickCount(autoclick)
      setLevelCount(newLevelCount)
      setLevelAutoclick(newLevelAutoclick)
      localStorage.setItem("autoclickCount", autoclick)
      localStorage.setItem("levelCount", newLevelCount)
      localStorage.setItem("levelAutoclick", newLevelAutoclick)
    }
  }

  return (
    <>
      <h3>{language === "en" ? "Autoclicker" : "Автокликер"}</h3>
      <div>
        <h4 className="lvlAutoclickCount">
          {language === "en" ? "LVL" : "Ур."} {levelAutoclick}
        </h4>
      </div>
      <div className="cardsBlock">
        {levelsAutoclicker.map((lev) => (
          <div className={autoclickCount <= lev.level ? "levelCard" : "levelCard bought"} key={lev.level} onClick={() => buyLevel(lev.autoclick, lev.price, lev.level)}>
            {(levelAutoclick + 1 < lev.level || levelCount < lev.price) && autoclickCount <= lev.level && (
              <div className="lock" onClick={(e) => e.stopPropagation()}>
                <HiLockClosed />
              </div>
            )}
            {autoclickCount <= lev.level && (
              <span className="price" onClick={(e) => e.stopPropagation()}>
                {lev.shouldLevel && lev?.shouldLevel[language]}
                {lev.shouldLevel && " + "}
                {lev.price} <RiCopperCoinLine />
              </span>
            )}

            <p className="autoclick">
              {lev.autoclick} <RiCopperCoinLine />/<span>{language === "en" ? "sec" : "сек"}</span>
            </p>
          </div>
        ))}
      </div>
    </>
  )
}

export default ModalAutoclicker
