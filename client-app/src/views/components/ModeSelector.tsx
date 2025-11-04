import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import ConstructionMode from "./ConstructionMode";
import FurnitureMode from "./FurnitureMode";

const containerSx = {
  backgroundColor: "#ececec",
  padding: 1,
  borderRadius: 2,
  width: 120,
  height: "fit-content",
  display: "flex",
  flexDirection: "column",
  position: "fixed",
  left: 16,
  top: 72,
  bottom: 16,
};

const buttonBaseSx = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  padding: 1,
  borderRadius: 2,
  marginBottom: 1,
};

const imageSx: React.CSSProperties = {
  width: 32,
  height: 32,
  objectFit: "contain",
};

const buttonTextSx: React.CSSProperties = {
  color: "#000",
  paddingTop: 1,
  fontSize: 12,
};

const activeModeSx: React.CSSProperties = {
  position: "fixed",
  left: 160,
  top: 72,
  width: 250,
  backgroundColor: "#ffffff",
  borderRadius: 2,
  boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
};

type Mode = "construction" | "furniture";

interface ModeSelectorProps {
  changeCursor: (url: string | null) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ changeCursor }) => {
  const [active, setActive] = useState<Mode>("construction");

  const makeStylesForBtn = (mode: Mode) => {
    const isActive = active === mode;
    return {
      backgroundColor: isActive ? "#cfcfcf" : "#ececec",
      "&:hover": { backgroundColor: isActive ? "#cfcfcf" : "#dfdfdf" },
    };
  };

  return (
    <>
      <Box sx={containerSx}>
        <ButtonBase
          onClick={() => setActive("construction")}
          sx={{ ...buttonBaseSx, ...makeStylesForBtn("construction") }}
        >
          <img
            src="/icons/construction.png"
            alt="construction"
            style={imageSx}
          />
          <Typography sx={buttonTextSx}>Construction</Typography>
        </ButtonBase>
        <ButtonBase
          onClick={() => setActive("furniture")}
          sx={{
            ...buttonBaseSx,
            ...makeStylesForBtn("furniture"),
            marginBottom: 0,
          }}
        >
          <img src="/icons/furniture.png" alt="furniture" style={imageSx} />
          <Typography sx={buttonTextSx}>Furniture</Typography>
        </ButtonBase>
      </Box>
      <Box sx={activeModeSx}>
        {active === "construction" && (
          <ConstructionMode changeCursor={changeCursor} />
        )}
        {active === "furniture" && <FurnitureMode />}
      </Box>
    </>
  );
};

export default ModeSelector;
