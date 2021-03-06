import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { BiHomeAlt, BiNews } from "react-icons/bi";
import {
  AiOutlineClockCircle,
  AiOutlinePieChart,
  AiOutlinePoweroff,
} from "react-icons/ai";
import { RiMedalFill } from "react-icons/ri";
import { GoSignIn } from "react-icons/go";

import female from "../img/female.png";
import male from "../img/male.png";
import guest from "../img/guest.png";

import RegisterForm from "./authentication/RegisterForm";
import SignInForm from "./authentication/SignInForm";
import AuthContext from "../context/AuthContext";

import ErrorMessage from "./authentication/ErrorMessage";
import "../styles/authentication/ErrorMessage.css";

import "../styles/authentication/RegisterForm.css";
import "../styles/authentication/SignInForm.css";

interface NavigationBarProps {
  width: number;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({ width }) => {
  const [activeMenu, setActiveMenu] = useState<boolean>(false);
  const {
    activeSignInForm,
    setActiveSignInForm,
    activeRegisterForm,
    setActiveRegisterForm,
    activeErrorMessage,
    user,
    logoutUser,
  } = useContext(AuthContext);

  // Disable scroll on body
  if (activeMenu && width < 1024) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "visible";
  }

  function handleMenuIcon() {
    setActiveMenu(!activeMenu);
  }

  function handleSignInButton() {
    setActiveMenu(false);
    if (setActiveSignInForm !== undefined)
      setActiveSignInForm(!activeSignInForm);
    if (setActiveRegisterForm !== undefined) setActiveRegisterForm(false);
  }

  function handleCreateAccountButton() {
    setActiveMenu(false);
    if (setActiveRegisterForm !== undefined)
      setActiveRegisterForm(!activeRegisterForm);
    if (setActiveSignInForm !== undefined) setActiveSignInForm(false);
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
          {user ? (
            user.checkbox === "female" ? (
              <img src={female} alt="" />
            ) : (
              <img src={male} alt="" />
            )
          ) : (
            <img src={guest} alt="" />
          )}

          <div>{user ? <p>{user?.username}</p> : <p>Guest</p>}</div>
        </div>

        <ul className="menu-links">
          <li>
            <Link
              to="/cryptocurrency_viewer"
              onClick={() => setActiveMenu(false)}
              style={
                useLocation().pathname === "/cryptocurrency_viewer"
                  ? styleLink
                  : undefined
              }
            >
              <BiHomeAlt
                style={
                  useLocation().pathname === "/cryptocurrency_viewer"
                    ? styleSvg
                    : undefined
                }
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
          {user ? (
            <button onClick={() => logoutUser()}>
              <AiOutlinePoweroff /> Sign out
            </button>
          ) : (
            <button onClick={() => handleSignInButton()}>
              <GoSignIn /> Sign in
            </button>
          )}
          {!user && (
            <p>
              Not registered yet?{" "}
              <span onClick={() => handleCreateAccountButton()}>
                Create an Account
              </span>
            </p>
          )}
        </div>
      </div>
      {activeErrorMessage && <ErrorMessage />}
      {activeSignInForm && <SignInForm />}
      {activeRegisterForm && <RegisterForm />}
    </div>
  );
};

export default NavigationBar;
