import { createContext, useState } from "react";
import jwt_decode from "jwt-decode";
import { IAuthContext } from "../interfaces/IAuthContext";

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export default AuthContext;

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<any>();
  const [accessToken, setAccessToken] = useState<string>();
  const [refreshToken, setRefreshToken] = useState<string>();
  const [activeRegisterForm, setActiveRegisterForm] = useState<boolean>(false);
  const [activeSignInForm, setActiveSignInForm] = useState<boolean>(false);
  const [activeErrorMessage, setActiveErrorMessage] = useState<boolean>(false);
  const [errorMessageTxt, setErrorMessageTxt] = useState<string>();

  let loginUser = async (e: any) => {
    e.preventDefault();

    const response = await fetch(
      "https://cryptocurrencyviewer.herokuapp.com/api/users/sign_in",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          email: e.target.email.value,
          password: e.target.password.value,
        }),
      }
    );

    let result = await response.json();

    if (result.status === 200) {
      setAccessToken(result.data.accessToken);
      setRefreshToken(result.data.refreshToken);
      setUser(jwt_decode(result.data.accessToken));
      setActiveSignInForm(false);
      setActiveRegisterForm(false);
      handleErrorMessage("Logged in successfully");
    } else {
      handleErrorMessage(result.error);
    }
  };

  let updateToken = async () => {
    const response = await fetch(
      "https://cryptocurrencyviewer.herokuapp.com/api/users/refresh_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken: refreshToken }),
      }
    ).then((res) => res.json());

    if (response.status === 200) {
      setAccessToken(response.accessToken);
      setRefreshToken(response.refreshToken);
    } else {
      logoutUser();
    }
  };

  let logoutUser = () => {
    setUser("");
    setAccessToken("");
    setRefreshToken("");
    handleErrorMessage("You have been logged out");
  };

  function handleErrorMessage(txt: string) {
    setErrorMessageTxt(txt);
    setActiveErrorMessage(true);
    setTimeout(() => {
      setActiveErrorMessage(false);
    }, 2000);
  }

  let contextData = {
    loginUser,
    updateToken,
    user: user,
    accessToken: accessToken,
    setActiveRegisterForm,
    activeRegisterForm,
    setActiveSignInForm,
    activeSignInForm,
    handleErrorMessage,
    setActiveErrorMessage,
    activeErrorMessage,
    setErrorMessageTxt,
    errorMessageTxt,
    logoutUser,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
