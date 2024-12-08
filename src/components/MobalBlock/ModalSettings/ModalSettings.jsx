import React, { useEffect, useState } from "react"
import { FaRegTrashCan } from "react-icons/fa6"
import "./modalSettings.css"

const ModalSettings = ({ language, setLanguage, setLevel, setLevelCount, setGameEng, setAutoclickCount }) => {
  const [trashCanVisible, setTrashCanVisible] = useState(false)

  const handleLanguageChange = (language) => {
    localStorage.setItem("language", language)
    setLanguage(language)
  }

  useEffect(() => {
    let noVisibleTrashTimeout

    if (trashCanVisible) {
      noVisibleTrashTimeout = setTimeout(() => {
        setTrashCanVisible(false)
      }, 1500)
    }

    return () => {
      clearTimeout(noVisibleTrashTimeout)
    }
  }, [trashCanVisible])

  const onClearProgress = () => {
    localStorage.removeItem("level")
    setLevel(1)
    localStorage.removeItem("levelCount")
    setLevelCount(0)
    localStorage.removeItem("autoclickCount")
    localStorage.removeItem("levelAutoclick")
    setAutoclickCount(null)
    setTrashCanVisible(false)
    setGameEng(false)
  }

  return (
    <>
      <h3>{language === "en" ? "Settings" : "Настройки"}</h3>
      <div>
        <h4>{language === "en" ? "Language" : "Язык"}</h4>
        <button className={"btnLanguage"} disabled={language === "en"} onClick={() => handleLanguageChange("en")}>
          {language === "en" ? "English" : "Английский"}
        </button>
        <button className={"btnLanguage"} disabled={language === "ru"} onClick={() => handleLanguageChange("ru")}>
          {language === "en" ? "Russian" : "Русский"}
        </button>
      </div>
      <h4>{language === "en" ? "Game" : "Игра"}</h4>
      <div className="deleteBlock">
        <button onClick={() => setTrashCanVisible(true)} className="deleteProgressBtn">
          {language === "en" ? "Clear the progress" : "Очистить прогресс"}
        </button>
        {trashCanVisible && (
          <button onClick={onClearProgress} className="trashCanBtn">
            <FaRegTrashCan />
          </button>
        )}
      </div>
    </>
  )
}

export default ModalSettings
