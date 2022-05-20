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

import Statistics from "./components/Statistics";
import "./styles/Statistics.css";

import Dashboard from "./components/dashboard/Dashboard";
import "./styles/dashboard/Dashboard.css";

function App() {
  const [width, setWidth] = useState<number>(window.innerWidth);

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
          <NavigationBar width={width} />
          <Routes>
            <Route path="/cryptocurrency_viewer" element={<Dashboard />} />
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
