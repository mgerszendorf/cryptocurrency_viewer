import React, { useState, useContext } from "react";
import { MdClose } from "react-icons/md";
import AuthContext from "../../context/AuthContext";

export const RegisterForm: React.FC = () => {
  const [registerFormData, setRegisterFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    checkbox: "",
    favoriteCryptocurrencies: [],
  });
  const { setActiveSignInForm, setActiveRegisterForm, handleErrorMessage } =
    useContext(AuthContext);

  function handleRegisterFormCloseBtn() {
    if (setActiveRegisterForm !== undefined) setActiveRegisterForm(false);
  }

  function handleRegisterFormCreateBtn() {
    if (setActiveSignInForm !== undefined) setActiveSignInForm(true);
    if (setActiveRegisterForm !== undefined) setActiveRegisterForm(false);
  }

  async function sendRegisterFormData(e: any) {
    e.preventDefault();

    const result = await fetch("http://localhost:8000/api/users/register", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(registerFormData),
    }).then((response) => response.json());

    if (result.status === 200) {
      handleErrorMessage("Success");
      handleRegisterFormCreateBtn();
    } else {
      console.log(result.error);
      handleErrorMessage(result.error);
    }
  }

  return (
    <section className="register-form">
      <div className="register-form-close-btn">
        <MdClose onClick={() => handleRegisterFormCloseBtn()} />
      </div>
      <div className="register-form-header">
        <h2>Create Account</h2>
      </div>
      <form
        id="registration-form"
        className="registration-form"
        onSubmit={(e) => sendRegisterFormData(e)}
      >
        <input
          required
          type="text"
          id="username"
          placeholder="Username"
          onFocus={(e) => (e.target.placeholder = "")}
          onBlur={(e) => (e.target.placeholder = "Username")}
          onChange={(e) =>
            setRegisterFormData((prevState) => ({
              ...prevState,
              username: e.target.value,
            }))
          }
        />
        <input
          required
          type="email"
          id="email"
          placeholder="Email"
          onFocus={(e) => (e.target.placeholder = "")}
          onBlur={(e) => (e.target.placeholder = "Email")}
          onChange={(e) =>
            setRegisterFormData((prevState) => ({
              ...prevState,
              email: e.target.value,
            }))
          }
        />
        <input
          required
          type="password"
          id="password"
          placeholder="Password"
          onFocus={(e) => (e.target.placeholder = "")}
          onBlur={(e) => (e.target.placeholder = "Password")}
          onChange={(e) =>
            setRegisterFormData((prevState) => ({
              ...prevState,
              password: e.target.value,
            }))
          }
        />
        <input
          required
          type="password"
          id="confirm_password"
          placeholder="Confirm Password"
          onFocus={(e) => (e.target.placeholder = "")}
          onBlur={(e) => (e.target.placeholder = "Confirm Password")}
          onChange={(e) =>
            setRegisterFormData((prevState) => ({
              ...prevState,
              confirmPassword: e.target.value,
            }))
          }
        />
        <div className="register-form-checkbox">
          <label className="control control-checkbox">
            Male
            <input
              type="checkbox"
              onChange={() =>
                setRegisterFormData((prevState) => ({
                  ...prevState,
                  checkbox: "male",
                }))
              }
            />
            <div className="control-indicator"></div>
          </label>
          <label className="control control-checkbox">
            Female
            <input
              type="checkbox"
              onChange={(e) =>
                setRegisterFormData((prevState) => ({
                  ...prevState,
                  checkbox: "female",
                }))
              }
            />
            <div className="control-indicator"></div>
          </label>
        </div>
        <button type="submit">Sign up</button>
        <p>
          If you already have an account.{" "}
          <span onClick={() => handleRegisterFormCreateBtn()}>Sign in</span>
        </p>
      </form>
    </section>
  );
};

export default RegisterForm;
