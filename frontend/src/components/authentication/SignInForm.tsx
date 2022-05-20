import React, { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { GoSignIn } from "react-icons/go";
import { MdClose } from "react-icons/md";

export const SignInForm: React.FC = () => {
  const { setActiveSignInForm, setActiveRegisterForm, loginUser } =
    useContext(AuthContext);

  function handleSignInCloseBtn() {
    if (setActiveSignInForm !== undefined) setActiveSignInForm(false);
  }

  function handleSignInCreateBtn() {
    if (setActiveRegisterForm !== undefined) setActiveRegisterForm(true);
    if (setActiveSignInForm !== undefined) setActiveSignInForm(false);
  }

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
        />
        <input
          required
          type="password"
          name="password"
          placeholder="Password"
          onFocus={(e) => (e.target.placeholder = "")}
          onBlur={(e) => (e.target.placeholder = "Password")}
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
