import React, { useCallback, useEffect } from "react"
import "./modalBlock.css"
import { IoClose } from "react-icons/io5"

const ModalBlock = ({ children, setTheModal }) => {
  const handleEscape = useCallback(
    (e) => {
      if (e.key === "Escape") {
        setTheModal(null)
      }
    },
    [setTheModal]
  )

  useEffect(() => {
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [handleEscape])

  return (
    <div onKeyDown={handleEscape} className="modal-overlay" onClick={() => setTheModal(null)}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="closeModal" onClick={() => setTheModal(null)}>
          <IoClose />
        </button>
        {children}
      </div>
    </div>
  )
}

export default ModalBlock
