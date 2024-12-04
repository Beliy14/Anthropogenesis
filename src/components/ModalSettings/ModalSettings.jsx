import React, { useCallback, useEffect, useState } from "react"
import { IoClose } from "react-icons/io5"
import { FaRegTrashCan } from "react-icons/fa6"
import "./modalSettings.css"

const ModalSettings = ({ setIsModalOpen, language, setLanguage, setLevel, setLevelCount, setGameEng }) => {
  const [trashCanVisible, setTrashCanVisible] = useState(false)

  const handleLanguageChange = (language) => {
    localStorage.setItem("language", language)
    setLanguage(language)
  }

  const handleEscape = useCallback(
    (e) => {
      if (e.key === "Escape") {
        setIsModalOpen(false)
      }
    },
    [setIsModalOpen]
  )

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

  useEffect(() => {
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [handleEscape])

  const onClearProgress = () => {
    localStorage.removeItem("level")
    setLevel(1)
    setLevelCount(0)
    setTrashCanVisible(false)
    setGameEng(false)
  }

  return (
    <div onKeyDown={handleEscape} className="modal-overlay" onClick={() => setIsModalOpen(false)}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="closeModal" onClick={() => setIsModalOpen(false)}>
          <IoClose />
        </button>
        <h3>{language === "en" ? "Settings" : "Настройки"}</h3>
        <div>
          <h4>{language === "en" ? "Language" : "Язык"}</h4>
          <button className={"btnLanguage"} disabled={language === "en"} onClick={() => handleLanguageChange("en")}>
            {language === "en" ? "En" : "Английский"}
          </button>
          <button className={"btnLanguage"} disabled={language === "ru"} onClick={() => handleLanguageChange("ru")}>
            {language === "en" ? "Ru" : "Русский"}
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
      </div>
    </div>
  )
}

export default ModalSettings
