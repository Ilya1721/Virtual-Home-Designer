import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import React from "react";

const iconSx: React.CSSProperties = {
  width: 32,
  height: 32,
  objectFit: "contain",
};

const buttonTextSx: React.CSSProperties = {
  marginTop: 1,
  fontSize: 12,
  color: "#000",
};

const itemButtonSx = {
  display: "flex",
  flexDirection: "column",
  padding: 1,
  borderRadius: 2,
  transition: "background-color 0.12s ease-in-out",
  "&:hover": { backgroundColor: "#efeeeeff" },
};

const buttonsGridSx: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 2,
  margin: 1,
};

const modeNameSx: React.CSSProperties = {
  margin: 1,
  paddingLeft: 2,
  fontSize: 16,
  fontWeight: 600,
};

const ConstructionMode: React.FC = () => {
  return (
    <>
      <Typography variant="subtitle1" sx={modeNameSx}>
        Construction
      </Typography>
      <Box sx={buttonsGridSx}>
        <ButtonBase sx={itemButtonSx}>
          <img src="/icons/wall.png" alt="wall" style={iconSx} />
          <Typography sx={buttonTextSx}>Wall</Typography>
        </ButtonBase>
        <ButtonBase sx={itemButtonSx}>
          <img src="/icons/window.png" alt="window" style={iconSx} />
          <Typography sx={buttonTextSx}>Window</Typography>
        </ButtonBase>
        <ButtonBase sx={itemButtonSx}>
          <img src="/icons/door.png" alt="door" style={iconSx} />
          <Typography sx={buttonTextSx}>Door</Typography>
        </ButtonBase>
      </Box>
    </>
  );
};

export default ConstructionMode;
