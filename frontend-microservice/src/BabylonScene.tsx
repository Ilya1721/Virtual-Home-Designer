import { Engine, Scene } from "@babylonjs/core";
import * as BABYLON from "@babylonjs/core";
import { useEffect, useRef } from "react";
import React from "react";

const BabylonScene = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const engine = new Engine(canvas, true);
    const scene = new Scene(engine);

    const camera = new BABYLON.ArcRotateCamera(
      "Camera",
      Math.PI / 2,
      Math.PI / 2,
      2,
      BABYLON.Vector3.Zero(),
      scene
    );
    camera.attachControl(canvas, true);

    const light = new BABYLON.HemisphericLight(
      "Light",
      new BABYLON.Vector3(0, 1, 0),
      scene
    );

    const sphere = BABYLON.MeshBuilder.CreateSphere(
      "Sphere",
      { diameter: 1 },
      scene
    );

    engine.runRenderLoop(() => {
      scene.render();
    });

    window.addEventListener("resize", () => {
      engine.resize();
    });

    return () => {
      engine.dispose();
      window.removeEventListener("resize", () => {
        engine.resize();
      });
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100vh" }} />;
};

export default BabylonScene;