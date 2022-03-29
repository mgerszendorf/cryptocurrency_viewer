import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./styles/App.css";

import NavigationBar from "./components/NavigationBar";
import "./styles/NavigationBar.css";

import News from "./components/News";
import "./styles/News.css";

import Ranking from "./components/Ranking";
import "./styles/Ranking.css";

import LiveChart from "./components/LiveChart";
import "./styles/LiveChart.css";

import RegisterForm from "./components/authentication/RegisterForm";
import "./styles/authentication/RegisterForm.css";

import SignInForm from "./components/authentication/SignInForm";
import "./styles/authentication/SignInForm.css";

import ErrorMessage from "./components/authentication/ErrorMessage";
import "./styles/authentication/ErrorMessage.css";

function App() {
  const [width, setWidth] = useState<number>(window.innerWidth);
  const [activeUuid, setActiveUuid] = useState<string>("Qwsogvtv82FCd");

  const [activeRegisterForm, setActiveRegisterForm] = useState<boolean>(false);
  const [activeSignInForm, setActiveSignInForm] = useState<boolean>(false);
  const [activeErrorMessage, setActiveErrorMessage] = useState<boolean>(false);
  const [errorMessageTxt, setErrorMessageTxt] = useState<string>();

  function handleErrorMessage(txt: string) {
    setErrorMessageTxt(txt);
    setActiveErrorMessage(true);
    setTimeout(() => {
      setActiveErrorMessage(false);
    }, 2000);
  }

  // Checking the window size for the mobile version
  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  return (
    <div className="App">
      {activeErrorMessage && <ErrorMessage errorMessageTxt={errorMessageTxt} />}
      {activeSignInForm ? (
        <SignInForm
          setActiveSignInForm={setActiveSignInForm}
          setActiveRegisterForm={setActiveRegisterForm}
          handleErrorMessage={handleErrorMessage}
        />
      ) : null}
      {activeRegisterForm ? (
        <RegisterForm
          setActiveSignInForm={setActiveSignInForm}
          setActiveRegisterForm={setActiveRegisterForm}
          handleErrorMessage={handleErrorMessage}
        />
      ) : null}
      <NavigationBar
        width={width}
        setActiveRegisterForm={setActiveRegisterForm}
        activeRegisterForm={activeRegisterForm}
        setActiveSignInForm={setActiveSignInForm}
        activeSignInForm={activeSignInForm}
      />
      <Routes>
        <Route path="/news" element={<News />} />
        <Route
          path="/ranking"
          element={<Ranking setActiveUuid={setActiveUuid} />}
        />
        <Route
          path="/live_chart"
          element={
            <LiveChart setActiveUuid={setActiveUuid} activeUuid={activeUuid} />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
