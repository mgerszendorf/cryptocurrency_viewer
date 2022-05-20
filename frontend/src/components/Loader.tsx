import React from "react";
import "../styles/Loader.css";
import BeatLoader from "react-spinners/BeatLoader";

const Loader = () => (
  <div className="loader">
    <BeatLoader color="#ff3572" size={10} />
  </div>
);

export default Loader;
