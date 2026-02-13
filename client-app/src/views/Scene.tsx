import { useEffect, useRef } from "react";
import React from "react";
import { GlobalContext } from "../Main";

const Scene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { scene, sceneInjection, sceneDisposal, activeMode } =
    React.useContext(GlobalContext);

  const getCursorClassName = (): string => {
    return activeMode !== "none" ? "no-cursor" : "";
  };

  useEffect(() => {
    if (!scene) {
      sceneInjection(canvasRef.current);
    } else {
      scene.render();
    }
  }, [scene, sceneInjection]);

  useEffect(() => {
    return () => {
      sceneDisposal();
    };
  }, [sceneDisposal]);

  return <canvas ref={canvasRef} className={`scene ${getCursorClassName()}`} />;
};

export default Scene;
