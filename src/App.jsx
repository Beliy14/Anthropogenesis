import React, { useEffect, useState, useRef } from "react"
import MonkeyCard from "./components/MonkeyCard/MonkeyCard"
import LevelBar from "./components/LevelBar/LevelBar"
import ModalSettings from "./components/MobalBlock/ModalSettings/ModalSettings"
import ModalBlock from "./components/MobalBlock/ModalBlock"
import ModalAutoclicker from "./components/MobalBlock/ModalAutoclicker.jsx/ModaAutoclicker"
import InfoHover from "./components/InfoHover/InfoHover"
import { countBorder, MAX_LEVEL, BUSTER_TIME, BUSTER_COOLDOWN } from "./consts"
import { IoSettingsSharp } from "react-icons/io5"
import { RiCopperCoinLine } from "react-icons/ri"
import { GiMonkey } from "react-icons/gi"
import "./app.css"

function App() {
  const [level, setLevel] = useState(Number(localStorage.getItem("level")) || 1)
  const [levelCount, setLevelCount] = useState(Number(localStorage.getItem("levelCount")) ?? 0)
  const [buster, setBuster] = useState(1)
  const [busterTime, setBusterTime] = useState(Number(localStorage.getItem("busterTime")) || BUSTER_TIME)
  const [busterCooldown, setBusterCooldown] = useState(Number(localStorage.getItem("busterCooldown")) ?? 0)
  const [theModal, setTheModal] = useState("")
  const [language, setLanguage] = useState(localStorage.getItem("language") ?? "en")
  const [autoclickCount, setAutoclickCount] = useState(Number(localStorage.getItem("autoclickCount")) || null)
  const [hoverInfo, setHoverInfo] = useState({ text: "", position: { top: 0, left: 0 } })
  const [gameEnd, setGameEnd] = useState(false)

  const busterInterval = useRef(null)
  const autoclickInterval = useRef(null)

  useEffect(() => {
    if (autoclickCount) {
      autoclickInterval.current = setInterval(() => {
        setLevelCount((prevLevelCount) => {
          const newLevelCount = prevLevelCount + autoclickCount
          localStorage.setItem("levelCount", newLevelCount)
          return newLevelCount
        })
      }, 1000)
    } else {
      clearInterval(autoclickInterval.current)
    }

    return () => {
      clearInterval(autoclickInterval.current)
    }
  }, [autoclickCount])

  useEffect(() => {
    if (levelCount >= countBorder[level]) {
      setLevel((prevLevel) => {
        const newLevel = prevLevel + 1
        localStorage.setItem("level", newLevel)
        return newLevel
      })
      setLevelCount(0)
      localStorage.setItem("levelCount", 0)
    }
  }, [level, levelCount])

  useEffect(() => {
    if (level >= MAX_LEVEL) {
      setGameEnd(true)
    }
  }, [level])

  useEffect(() => {
    let timeoutId

    if (buster === 2) {
      timeoutId = setTimeout(() => {
        if (busterTime === BUSTER_TIME) {
          window.location.reload()
        }
      }, 1100)
    }

    return () => {
      clearTimeout(timeoutId)
    }
  }, [buster, busterTime])

  const onBuster = () => {
    setBusterTime(BUSTER_TIME)
    localStorage.setItem("busterTime", BUSTER_TIME)
    setBuster(2)
    clearInterval(busterInterval.current)
    busterInterval.current = setInterval(() => {
      setBusterTime((prev) => {
        const newTime = prev - 1000
        localStorage.setItem("busterTime", newTime)
        return newTime
      })
    }, 1000)
  }

  useEffect(() => {
    if (busterTime === 0) {
      clearInterval(busterInterval.current)
      setBuster(1)
      setBusterCooldown(BUSTER_COOLDOWN)
      localStorage.setItem("busterCooldown", BUSTER_COOLDOWN)
      localStorage.removeItem("busterTime")
    }
  }, [busterTime])

  useEffect(() => {
    let cooldownInterval
    if (busterCooldown > 0) {
      cooldownInterval = setInterval(() => {
        setBusterCooldown((prev) => {
          const newCooldown = prev - 1000
          localStorage.setItem("busterCooldown", newCooldown)
          return newCooldown
        })
      }, 1000)
    } else {
      clearInterval(cooldownInterval)
      localStorage.removeItem("busterCooldown")
    }

    return () => {
      clearInterval(cooldownInterval)
    }
  }, [busterCooldown])

  useEffect(() => {
    if (busterTime < BUSTER_TIME && busterTime > 0) {
      setBuster(2)
      busterInterval.current = setInterval(() => {
        setBusterTime((prev) => {
          const newTime = prev - 1000
          localStorage.setItem("busterTime", newTime)
          return newTime
        })
      }, 1000)
    } else {
      clearInterval(busterInterval.current)
      localStorage.removeItem("busterTime")
    }

    return () => {
      clearInterval(busterInterval.current)
    }
  }, [busterTime])

  const toRealTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60

    const formattedMinutes = String(minutes).padStart(2, "0")
    const formattedSeconds = String(seconds).padStart(2, "0")

    return `${formattedMinutes}:${formattedSeconds}`
  }

  const handleMouseEnter = (text, event) => {
    const rect = event.target.getBoundingClientRect()
    setHoverInfo({
      text,
      position: {
        top: rect.bottom + window.scrollY,
        left: rect.left + rect.width / 2 + window.scrollX,
      },
    })
  }

  const handleMouseLeave = () => {
    setHoverInfo({ text: "", position: { top: 0, left: 0 } })
  }

  return (
    <div className="app">
      <h1 className="title">{language === "en" ? "Anthropogenesis" : "Антропогенез"}</h1>
      <div className="subtitleContainer">
        <h3>{gameEnd ? (language === "en" ? "The end of the game!" : "Конец игры!") : (language === "en" ? "Level " : "Уровень ") + level + "/6"}</h3>
        {autoclickCount && (
          <div
            className="autoclickerCount"
            onMouseEnter={(e) => handleMouseEnter(language === "en" ? `${autoclickCount} coins per second` : `${autoclickCount} ${autoclickCount === 5 ? "монет" : "монеты"} в секунду`, e)}
            onMouseLeave={handleMouseLeave}
          >
            {autoclickCount} <RiCopperCoinLine />/<span>{language === "en" ? "sec" : "сек"}</span>
          </div>
        )}
      </div>
      <LevelBar level={level} levelCount={levelCount} gameEng={gameEnd} />
      <MonkeyCard level={level} setLevelCount={setLevelCount} levelCount={levelCount} buster={buster} language={language} gameEnd={gameEnd} />
      <div className="btnBlock">
        <button
          onClick={onBuster}
          onKeyDown={onBuster}
          className="btn"
          disabled={buster === 2 || busterCooldown > 0}
          onMouseEnter={(e) => handleMouseEnter(language === "en" ? "Double click" : "Удвоенный клик", e)}
          onMouseLeave={handleMouseLeave}
        >
          +2
        </button>
        <button
          className="btn btnAutoclicker"
          onClick={() => setTheModal("autoclicker")}
          onMouseEnter={(e) => handleMouseEnter(language === "en" ? "Autoclicker" : "Автокликер", e)}
          onMouseLeave={handleMouseLeave}
        >
          <GiMonkey />
        </button>
        <button
          className="btn btnSettings"
          onClick={() => setTheModal("settings")}
          onMouseEnter={(e) => handleMouseEnter(language === "en" ? "Settings" : "Настройки", e)}
          onMouseLeave={handleMouseLeave}
        >
          <IoSettingsSharp />
        </button>
      </div>
      {busterTime !== 0 && busterTime !== BUSTER_TIME && <span>{toRealTime(busterTime)}</span>}
      {busterCooldown > 0 && (
        <span>
          {language === "en" ? "Cooldown" : "Перезарядка"}: {toRealTime(busterCooldown)}
        </span>
      )}

      {theModal === "settings" && (
        <ModalBlock setTheModal={setTheModal}>
          <ModalSettings language={language} setLanguage={setLanguage} setLevel={setLevel} setLevelCount={setLevelCount} setGameEng={setGameEnd} setAutoclickCount={setAutoclickCount} />
        </ModalBlock>
      )}
      {theModal === "autoclicker" && (
        <ModalBlock setTheModal={setTheModal}>
          <ModalAutoclicker language={language} levelCount={levelCount} setLevelCount={setLevelCount} autoclickCount={autoclickCount} setAutoclickCount={setAutoclickCount} />
        </ModalBlock>
      )}

      <InfoHover text={hoverInfo.text} position={hoverInfo.position} />
    </div>
  )
}

export default App
