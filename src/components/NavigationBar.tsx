import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BiHomeAlt, BiNews } from "react-icons/bi";
import {
  AiOutlineClockCircle,
  AiOutlinePieChart,
  AiOutlinePoweroff,
} from "react-icons/ai";
import { RiMedalFill } from "react-icons/ri";
import { GoSignIn } from "react-icons/go";

import user from "../img/user.png";

interface NavigationBarProps {
  width: number;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({ width }) => {
  const [activeMenu, setActiveMenu] = useState<boolean>(false);

  function handleMenuIcon() {
    setActiveMenu(!activeMenu);
  }

  // Style for the active menu link
  const styleLink = {
    backgroundColor: "#21212b",
    padding: "1.5rem 2rem",
    color: "#fff",
  };
  const styleSvg = {
    color: "#1fc2a0",
  };

  return (
    <div className="navigation-bar">
      <div className="menu-icon">
        {activeMenu ? (
          <input
            checked
            type="checkbox"
            className="dot-menu dot-menu__checkbox"
            id="dot-menu"
            onClick={() => handleMenuIcon()}
          />
        ) : (
          <input
            type="checkbox"
            className="dot-menu dot-menu__checkbox"
            id="dot-menu"
            onClick={() => handleMenuIcon()}
          />
        )}

        <label htmlFor="dot-menu" className="dot-menu__label">
          <span></span>
        </label>
      </div>
      <div className={activeMenu || width > 1024 ? "menu" : "menu none"}>
        <div className="user-icon" onClick={() => setActiveMenu(false)}>
          <img src={user} alt="" />
          <div>
            <p>Lana </p>
            <p>Steiner</p>
          </div>
        </div>

        <ul className="menu-links">
          <li>
            <Link
              to="/"
              onClick={() => setActiveMenu(false)}
              style={useLocation().pathname === "/" ? styleLink : undefined}
            >
              <BiHomeAlt
                style={useLocation().pathname === "/" ? styleSvg : undefined}
              />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/live_chart"
              onClick={() => setActiveMenu(false)}
              style={
                useLocation().pathname === "/live_chart" ? styleLink : undefined
              }
            >
              <AiOutlineClockCircle
                style={
                  useLocation().pathname === "/live_chart"
                    ? styleSvg
                    : undefined
                }
              />
              Live Chart
            </Link>
          </li>
          <li>
            <Link
              to="/statistics"
              onClick={() => setActiveMenu(false)}
              style={
                useLocation().pathname === "/statistics" ? styleLink : undefined
              }
            >
              <AiOutlinePieChart
                style={
                  useLocation().pathname === "/statistics"
                    ? styleSvg
                    : undefined
                }
              />
              Statistics
            </Link>
          </li>
          <li>
            <Link
              to="/ranking"
              onClick={() => setActiveMenu(false)}
              style={
                useLocation().pathname === "/ranking" ? styleLink : undefined
              }
            >
              <RiMedalFill
                style={
                  useLocation().pathname === "/ranking" ? styleSvg : undefined
                }
              />
              Ranking
            </Link>
          </li>
          <li>
            <Link
              to="/news"
              onClick={() => setActiveMenu(false)}
              style={useLocation().pathname === "/news" ? styleLink : undefined}
            >
              <BiNews
                style={
                  useLocation().pathname === "/news" ? styleSvg : undefined
                }
              />
              News
            </Link>
          </li>
        </ul>
        <div className="button-authentication-wrapper">
          <button>
            <GoSignIn /> Sign in
          </button>
          <p>
            Not registered yet? <span>Create an Account</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
