import React from "react";
import "./Compass.css";

const Compass = ({ windDegree }) => {
  const getRotationStyle = (degree) => {
    return {
      transform: `rotate(${degree}deg)`,
    };
  };

  return (
    <div className="compass-container">
      <div className="compass">
        <div className="compass-pointer" style={getRotationStyle(windDegree)}></div>
      </div>
      <div className="wind-direction">{windDegree}°</div>
    </div>
  );
};

export default Compass;
