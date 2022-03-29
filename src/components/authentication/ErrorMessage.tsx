import React from "react";

interface ErrorMessageProps {
  errorMessageTxt: string | undefined;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  errorMessageTxt,
}) => {
  return (
    <div className="error-message">
      <p>{errorMessageTxt}</p>
    </div>
  );
};

export default ErrorMessage;
