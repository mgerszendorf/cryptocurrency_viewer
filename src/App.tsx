import React, { useState, useEffect } from "react";
import "./styles/App.css";

import NavigationBar from "./components/NavigationBar";
import "./styles/NavigationBar.css";

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
      <NavigationBar width={width} />
    </div>
  );
}

export default App;
