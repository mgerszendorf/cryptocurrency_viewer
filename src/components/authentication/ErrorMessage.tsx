import React, { useContext } from "react";
import AuthContext from "../../context/AuthContext";

export const ErrorMessage: React.FC = () => {
  const { errorMessageTxt } = useContext(AuthContext);

  return (
    <div className="error-message">
      <p>{errorMessageTxt}</p>
    </div>
  );
};

export default ErrorMessage;
