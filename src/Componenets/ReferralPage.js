import React, { useState } from "react";
import "./style.css";

const ReferralPage = () => {
  const [code, setCode] = useState(localStorage.getItem("code") || "DEFAULT123");
  const [isLaunching, setIsLaunching] = useState(false);

  const handleCopyCode = async () => {
    navigator.clipboard.writeText("http://localhost:3000/refuser " + code);
    setIsLaunching(true);

    // Bring back the text and button after the rocket GIF animation
    setTimeout(() => {
      setIsLaunching(false);
    }, 3000); // Adjust duration to match your GIF length
  };

  return (
    <div className="referral-container">
      <h1 className="referral-title">Refer and Earn</h1>
      <p className="referral-description">
        Invite your friends to join and earn rewards for every successful referral!
      </p>
      <div className="referral-code-container">
        <span className="referral-code">{code}</span>
        <button
          className={`copy-button ${isLaunching ? "launching" : ""}`}
          onClick={handleCopyCode}
        >
          {isLaunching ? (
            <img
              src="https://i.gifer.com/origin/03/03758c866f08804058b20bfc18f0b919_w200.gif"
              alt="Rocket Launching"
              className="rocket-gif"
            />
          ) : (
            "Copy Code"
          )}
        </button>
      </div>
    </div>
  );
};

export default ReferralPage;
