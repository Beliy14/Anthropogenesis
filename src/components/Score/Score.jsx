import React from "react"
import "./score.css"

const Score = ({ score, x, y }) => {
  const style = {
    position: "absolute",
    top: y - 20,
    left: x - 10,
    color: "#534caf",
    zIndex: 99,
    pointerEvents: "none",
    userSelect: "none",
    fontWeight: 700,
    fontSize: "20px",
    textShadow: "0 0 4px #5d56bb",
    background: "linear-gradient(180deg, #534caf 0%, #1e1c3a 100%)",
    backgroundClip: "text",
    animation: "moveUp 1s ease-out forwards",
  }

  return <p style={style}>+{score}</p>
}

export default Score