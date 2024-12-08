import React from "react"

const InfoHover = ({ text, position }) => {
  const style = {
    position: "absolute",
    top: position.top + 6,
    left: position.left,
    padding: "5px",
    backgroundColor: "#414246",
    color: "#fff",
    borderRadius: "5px",
    zIndex: 10,
    display: text ? "block" : "none",
    transform: `translate(-50%, 0)`,
    fontSize: '12px',
    width: 'max-content',
  }

  const arrowStyle = {
    content: '""',
    position: "absolute",
    top: "-10px",
    left: "50%", 
    transform: "translateX(-50%)",
    borderWidth: "5px",
    borderStyle: "solid",
    borderColor: "transparent transparent #414246 transparent",
  }

  return (
    <div style={style}>
      <div style={arrowStyle} />
      {text}
    </div>
  )
}

export default InfoHover