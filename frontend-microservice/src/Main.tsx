import React from "react";
import { BabylonScene } from "./frontend_components/concrete/Babylon/components/Scene";
import { SCENE_OPTIONS } from "./frontend_components/concrete/Babylon/components/SceneOptions";
import { GlobalContext as GlobalContextType } from "./views/abstract/globalContext";
import Scene from "./views/Scene";

export const GlobalContext = React.createContext<GlobalContextType>(null);

function Main() {
  const [scene, setScene] = React.useState<GlobalContextType["scene"]>(null);

  const sceneInjection = React.useCallback((canvas: HTMLCanvasElement) => {
    if (!scene) {
      setScene(new BabylonScene(canvas, SCENE_OPTIONS));
    }
  }, [scene]);

  const globalContextValue = React.useMemo<GlobalContextType>(
    () => ({
      scene,
      sceneInjection,
    }),
    [scene, sceneInjection]
  );

  return (
    <GlobalContext.Provider value={globalContextValue}>
      <Scene />
    </GlobalContext.Provider>
  );
}

export default Main;