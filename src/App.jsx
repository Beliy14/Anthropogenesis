import React, { useEffect, useState, useRef } from "react"
import MonkeyCard from "./components/MonkeyCard/MonkeyCard"
import LevelBar from "./components/LevelBar/LevelBar"
import { countBorder } from "./consts"
import { IoSettingsSharp } from "react-icons/io5"
import ModalSettings from "./components/ModalSettings/ModalSettings"
import "./app.css"

function App() {
  const [level, setLevel] = useState(localStorage.getItem("level") ?? 1)
  const [levelCount, setLevelCount] = useState(0)
  const [buster, setBuster] = useState(1)
  const [busterTime, setBusterTime] = useState(30000)
  const [busterCooldown, setBusterCooldown] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [language, setLanguage] = useState(localStorage.getItem("language") ?? "en")
  const [gameEnd, setGameEnd] = useState(false)

  const maxLevel = 7

  const busterInterval = useRef(null)
  const cooldownInterval = useRef(null)

  useEffect(() => {
    if (levelCount >= countBorder[level]) {
      setLevel(Number(level) + 1)
      localStorage.setItem("level", Number(level) + 1)
      setLevelCount(0)
    }
  }, [level, levelCount])

  useEffect(() => {
    if (level >= maxLevel) {
      setGameEnd(true)
    }
  }, [level])

  const onBuster = () => {
    setBuster(2)
    busterInterval.current = setInterval(() => {
      setBusterTime((prev) => prev - 1000)
    }, 1000)
    setBusterTime(30000)
  }

  useEffect(() => {
    if (busterTime === 0) {
      clearInterval(busterInterval.current)
      setBuster(1)
      setBusterCooldown(60000)
    }
  }, [busterTime])

  useEffect(() => {
    if (busterCooldown > 0) {
      cooldownInterval.current = setInterval(() => {
        setBusterCooldown((prev) => prev - 1000)
      }, 1000)
    } else {
      clearInterval(cooldownInterval.current)
    }

    return () => {
      clearInterval(cooldownInterval.current)
    }
  }, [busterCooldown])

  const toRealTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60

    const formattedMinutes = String(minutes).padStart(2, "0")
    const formattedSeconds = String(seconds).padStart(2, "0")

    return `${formattedMinutes}:${formattedSeconds}`
  }

  return (
    <div className="app">
      <h1 className="title">{language === "en" ? "Fast clicker" : "Быстрый кликер"}</h1>
      <h3>{gameEnd ? (language === "en" ? "The end of the game!" : "Конец игры!") : (language === "en" ? "Level " : "Уровень ") + level + "/6"}</h3>

      <LevelBar level={level} levelCount={levelCount} gameEng={gameEnd} />
      <MonkeyCard level={level} setLevelCount={setLevelCount} levelCount={levelCount} buster={buster} language={language} gameEnd={gameEnd} />

      <div className="btnBlock">
        <button onClick={onBuster} className="btn" disabled={buster === 2 || busterCooldown > 0}>
          +2
        </button>
        <button className="btn btnSettings" onClick={() => setIsModalOpen(true)}>
          <IoSettingsSharp />
        </button>
      </div>
      {busterTime !== 0 && busterTime !== 30000 && <span>{toRealTime(busterTime)}</span>}
      {busterCooldown > 0 && (
        <span>
          {language === "en" ? "Cooldown" : "Перезарядка"}: {toRealTime(busterCooldown)}
        </span>
      )}

      {isModalOpen && <ModalSettings setIsModalOpen={setIsModalOpen} language={language} setLanguage={setLanguage} setLevel={setLevel} setLevelCount={setLevelCount} setGameEng={setGameEnd} />}
    </div>
  )
}

export default App
