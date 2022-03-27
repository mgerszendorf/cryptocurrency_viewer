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

function App() {
  const [width, setWidth] = useState<number>(window.innerWidth);
  const [activeUuid, setActiveUuid] = useState<string>("Qwsogvtv82FCd");

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
      <NavigationBar width={width} />
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
