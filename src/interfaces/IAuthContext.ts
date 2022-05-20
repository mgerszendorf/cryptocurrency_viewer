import { Dispatch, SetStateAction } from "react";

export interface IAuthContext {
  loginUser: (e: any) => Promise<void>;
  updateToken: () => Promise<void>;
  user: any;
  accessToken: string | undefined;
  setActiveRegisterForm: Dispatch<React.SetStateAction<boolean>>;
  activeRegisterForm: boolean;
  setActiveSignInForm: Dispatch<SetStateAction<any>>;
  activeSignInForm: boolean;
  handleErrorMessage: (txt: string) => void;
  setActiveErrorMessage: Dispatch<SetStateAction<any>>;
  activeErrorMessage: boolean;
  setErrorMessageTxt: Dispatch<SetStateAction<any>>;
  errorMessageTxt: string | undefined;
  logoutUser: () => void;
}
