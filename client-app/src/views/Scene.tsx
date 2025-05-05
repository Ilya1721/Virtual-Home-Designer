import { useCallback, useEffect, useRef } from "react";
import React from "react";
import { GlobalContext } from "../Main";

const Scene = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { scene, sceneInjection } = React.useContext(GlobalContext);

  const dispose = useCallback(() => {
    scene?.dispose();
  }, [scene]);

  const startup = useCallback(() => {
    scene?.render();
  }, [scene]);

  useEffect(() => {
    if (!canvasRef.current) return;
    sceneInjection(canvasRef.current);
    startup();
    return () => {
      dispose();
    }
  }, [dispose, sceneInjection, startup]);

  return <canvas ref={canvasRef} className="scene" />;
};

export default Scene;
