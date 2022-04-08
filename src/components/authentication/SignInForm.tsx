import React, {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";
import AuthContext from "../../context/AuthContext";
import { GoSignIn } from "react-icons/go";
import { MdClose } from "react-icons/md";

interface SignInFormProps {
  setActiveSignInForm?: Dispatch<SetStateAction<boolean>>;
  setActiveRegisterForm?: Dispatch<SetStateAction<boolean>>;
  handleErrorMessage(txt: string): void;
  setToken?: Dispatch<SetStateAction<string>>;
  token: string;
}

export const SignInForm: React.FC<SignInFormProps> = ({
  setActiveSignInForm,
  setActiveRegisterForm,
  handleErrorMessage,
  setToken,
  token,
}) => {
  const [signInFormData, setSignInFormData] = useState({
    email: "",
    password: "",
  });

  function handleSignInCloseBtn() {
    if (setActiveSignInForm !== undefined) setActiveSignInForm(false);
  }

  function handleSignInCreateBtn() {
    if (setActiveRegisterForm !== undefined) setActiveRegisterForm(true);
    if (setActiveSignInForm !== undefined) setActiveSignInForm(false);
  }

  function handleSetToken(token: string) {
    if (setToken !== undefined) setToken(token);
    if (token !== "") {
      if (setActiveRegisterForm !== undefined) setActiveRegisterForm(false);
      if (setActiveSignInForm !== undefined) setActiveSignInForm(false);
    }
  }

  // async function sendSignInFormData(e: any) {
  //   e.preventDefault();

  //   const result = await fetch("http://localhost:8000/api/users/sign_in", {
  //     method: "POST",
  //     headers: {
  //       "Content-type": "application/json",
  //     },
  //     body: JSON.stringify(signInFormData),
  //   }).then((res) => res.json());

  //   if (result.status === 200) {
  //     handleSetToken(result.data);
  //     localStorage.setItem("authTokens", result.data);
  //   } else {
  //     handleErrorMessage(result.error);
  //   }
  // }

  let { loginUser } = useContext(AuthContext);

  return (
    <section className="sign-in">
      <div className="sign-in-close-btn">
        <MdClose onClick={() => handleSignInCloseBtn()} />
      </div>
      <div className="sign-in-header">
        <h2 className="sign-in-welcome-txt-first">Hello!</h2>
        <h2 className="sign-in-welcome-txt-second">Sign into Your account</h2>
      </div>
      <form className="sign-in-form" onSubmit={(e) => loginUser(e)}>
        <input
          required
          type="email"
          name="email"
          placeholder="Email"
          onFocus={(e) => (e.target.placeholder = "")}
          onBlur={(e) => (e.target.placeholder = "Email")}
          onChange={(e) =>
            setSignInFormData((prevState) => ({
              ...prevState,
              email: e.target.value,
            }))
          }
        />
        <input
          required
          type="password"
          name="password"
          placeholder="Password"
          onFocus={(e) => (e.target.placeholder = "")}
          onBlur={(e) => (e.target.placeholder = "Password")}
          onChange={(e) =>
            setSignInFormData((prevState) => ({
              ...prevState,
              password: e.target.value,
            }))
          }
        />

        <button>
          <GoSignIn /> Sign in
        </button>
        <p>
          Don't have an account?{" "}
          <span onClick={() => handleSignInCreateBtn()}>Create</span>
        </p>
      </form>
    </section>
  );
};

export default SignInForm;
