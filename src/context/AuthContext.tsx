import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

const AuthContext = createContext<any>(null);

export default AuthContext;

export const AuthProvider: React.FC<any> = ({ children }) => {
  let [accessToken, setAccessToken] = useState<string>();
  let [refreshToken, setRefreshToken] = useState<string>();
  let [user, setUser] = useState<string>();
  let [loading, setLoading] = useState(true);

  let loginUser = async (e: any) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8000/api/users/sign_in", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email: e.target.email.value,
        password: e.target.password.value,
      }),
    }).then((res) => res.json());

    if (response.status === 200) {
      setAccessToken(response.data.accessToken);
      setRefreshToken(response.data.refreshToken);
      localStorage.setItem("accessToken", response.data.accessToken);
      if (accessToken !== undefined)
        setUser(jwt_decode(response.data.accessToken));
    } else {
      alert("Something went wrong!");
    }
  };

  let logoutUser = () => {
    setAccessToken("");
    setRefreshToken("");
    localStorage.removeItem("accessToken");
  };

  let updateToken = async () => {
    const response = await fetch(
      "http://localhost:8000/api/users/refresh_token",
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
      localStorage.setItem("accessToken", response.accessToken);
    } else {
      logoutUser();
    }

    if (loading) {
      setLoading(false);
    }
  };

  let contextData = {
    accessToken: accessToken,
    loginUser: loginUser,
    logoutUser: logoutUser,
  };

  useEffect(() => {
    if (loading) {
      updateToken();
    }

    let time = 1000 * 60 * 5;

    let interval = setInterval(() => {
      if (accessToken) {
        updateToken();
      }
    }, time);
    return () => clearInterval(interval);
  }, [accessToken, loading]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
