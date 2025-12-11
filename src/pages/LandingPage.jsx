import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/register");
  };

  return (
    <div>
      <p>LandingPage</p>
      <p>Welcome to Skillify</p>
      <button onClick={handleClick}>Get Started</button>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default LandingPage;
