import React from "react";
import { AuthService } from "./business_logic/concrete/auth";
import { BabylonScene } from "./frontend_components/concrete/Babylon/components/Scene";
import { SCENE_OPTIONS } from "./frontend_components/concrete/Babylon/components/SceneOptions";
import { GlobalContext as GlobalContextType } from "./views/abstract/globalContext";
import Header from "./views/components/Header";
import SignInForm from "./views/components/SignInForm";
import SignUpForm from "./views/components/SignUpForm";
import Scene from "./views/Scene";

export const GlobalContext = React.createContext<GlobalContextType>(null);

const Main = () => {
  const [scene, setScene] = React.useState<GlobalContextType["scene"]>(null);
  const [user, setUser] = React.useState<GlobalContextType["user"]>(null);
  const [signUpOpen, setSignUpOpen] = React.useState(false);
  const [signInOpen, setSignInOpen] = React.useState(false);

  const authService = React.useMemo(() => new AuthService(setUser), [setUser]);

  const sceneInjection = React.useCallback(
    (canvas: HTMLCanvasElement) => {
      if (!scene) {
        setScene(new BabylonScene(canvas, SCENE_OPTIONS));
      }
    },
    [scene]
  );

  const globalContextValue = React.useMemo<GlobalContextType>(
    () => ({
      scene,
      sceneInjection,
      user,
      setUser,
    }),
    [scene, user, sceneInjection]
  );

  const handleOpenSignUp = () => setSignUpOpen(true);
  const handleCloseSignUp = () => setSignUpOpen(false);
  const handleOpenSignIn = () => setSignInOpen(true);
  const handleCloseSignIn = () => setSignInOpen(false);

  return (
    <GlobalContext.Provider value={globalContextValue}>
      <Header
        onSignUp={handleOpenSignUp}
        onSignIn={handleOpenSignIn}
        authService={authService}
      />
      <Scene />
      <SignUpForm
        open={signUpOpen}
        onClose={handleCloseSignUp}
        authService={authService}
      />
      <SignInForm
        open={signInOpen}
        onClose={handleCloseSignIn}
        authService={authService}
      />
    </GlobalContext.Provider>
  );
};

export default Main;
