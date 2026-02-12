import { useEffect, useRef } from "react";
import React from "react";
import { GlobalContext } from "../Main";

interface SceneProps {
  cursorUrl: string | null;
}

const Scene: React.FC<SceneProps> = ({ cursorUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { scene, sceneInjection, sceneDisposal } =
    React.useContext(GlobalContext);
  const getCursorClass = () => {
    return cursorUrl ? "selection-cursor" : "";
  };

  useEffect(() => {
    if (!scene) {
      sceneInjection(canvasRef.current);
    } else {
      scene.render();
    }
    return () => {
      sceneDisposal();
    };
  }, [scene, sceneDisposal, sceneInjection]);

  return <canvas ref={canvasRef} className={`scene ${getCursorClass()}`} />;
};

export default Scene;
