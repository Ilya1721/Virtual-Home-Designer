import React, { useEffect } from "react";
import { AuthService } from "./business_logic/concrete/auth";
import { setUpAxiosResponseInterceptor } from "./business_logic/concrete/AxiosInterceptors";
import { BabylonScene } from "./frontend_components/concrete/Babylon/components/Scene";
import { SCENE_OPTIONS } from "./frontend_components/concrete/Babylon/components/SceneOptions";
import { GlobalContext as GlobalContextType } from "./views/abstract/globalContext";
import Header from "./views/components/Header";
import ModeSelector from "./views/components/ModeSelector";
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

  useEffect(() => {
    setUpAxiosResponseInterceptor(authService, user?.id);
  }, [authService, user]);

  return (
    <GlobalContext.Provider value={globalContextValue}>
      <Header
        onSignUp={handleOpenSignUp}
        onSignIn={handleOpenSignIn}
        authService={authService}
      />
      <Scene />
      <ModeSelector />
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
