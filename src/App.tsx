import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SelectCryptocurrencyProvider } from "./context/SelectCryptocurrencyContext";

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

import Statistics from "./components/Statistics";
import "./styles/Statistics.css";

import Dashboard from "./components/dashboard/Dashboard";
import "./styles/dashboard/Dashboard.css";

function App() {
  const [width, setWidth] = useState<number>(window.innerWidth);

  const [activeRegisterForm, setActiveRegisterForm] = useState<boolean>(false);
  const [activeSignInForm, setActiveSignInForm] = useState<boolean>(false);
  const [activeErrorMessage, setActiveErrorMessage] = useState<boolean>(false);
  const [errorMessageTxt, setErrorMessageTxt] = useState<string>();
  const [token, setToken] = useState<string>("");

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
      <AuthProvider>
        <SelectCryptocurrencyProvider>
          {activeErrorMessage && (
            <ErrorMessage errorMessageTxt={errorMessageTxt} />
          )}
          {activeSignInForm && (
            <SignInForm
              setActiveSignInForm={setActiveSignInForm}
              setActiveRegisterForm={setActiveRegisterForm}
              handleErrorMessage={handleErrorMessage}
              setToken={setToken}
              token={token}
            />
          )}
          {activeRegisterForm && (
            <RegisterForm
              setActiveSignInForm={setActiveSignInForm}
              setActiveRegisterForm={setActiveRegisterForm}
              handleErrorMessage={handleErrorMessage}
            />
          )}
          <NavigationBar
            width={width}
            setActiveRegisterForm={setActiveRegisterForm}
            activeRegisterForm={activeRegisterForm}
            setActiveSignInForm={setActiveSignInForm}
            activeSignInForm={activeSignInForm}
          />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/news" element={<News />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/live_chart" element={<LiveChart />} />
            <Route path="statistics" element={<Statistics />} />
          </Routes>
        </SelectCryptocurrencyProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
