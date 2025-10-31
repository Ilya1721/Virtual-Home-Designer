import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import React, { useEffect } from "react";
import { ConstructionModeSelector } from "../../frontend_components/concrete/Babylon/components/ConstructionModeSelector";
import { WallMode } from "../../frontend_components/concrete/Babylon/components/WallMode";
import { GlobalContext } from "../../Main";

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

type Mode = "wall" | "window" | "door" | "none";

const ConstructionMode: React.FC = () => {
  const [activeMode, setActiveMode] = React.useState<Mode>("none");
  const { scene } = React.useContext(GlobalContext);
  const constructionModeSelector = React.useMemo(() => {
    if (scene) {
      return new ConstructionModeSelector(scene);
    }
  }, [scene]);
  const wallMode = React.useRef(new WallMode());

  useEffect(() => {
    return () => {
      constructionModeSelector?.setMode(null);
    };
  }, [constructionModeSelector]);

  const makeStylesForBtn = (mode: Mode) => {
    const isActive = activeMode === mode;
    return {
      backgroundColor: isActive ? "#cfcfcfff" : "inherit",
      "&:hover": { backgroundColor: isActive ? "#cfcfcfff" : "inherit" },
    };
  };

  const activateMode = (mode: Mode) => {
    if (mode == activeMode) {
      setActiveMode("none");
      constructionModeSelector?.setMode(null);
    } else {
      setActiveMode(mode);
      switch (mode) {
        case "wall":
          constructionModeSelector?.setMode(wallMode.current);
          break;
        case "window":
          constructionModeSelector?.setMode(null);
          break;
        case "door":
          constructionModeSelector?.setMode(null);
          break;
      }
    }
  };

  const onWallBtnClicked = () => {
    activateMode("wall");
  };

  const onWindowBtnClicked = () => {
    activateMode("window");
  };

  const onDoorBtnClicked = () => {
    activateMode("door");
  };

  return (
    <>
      <Typography variant="subtitle1" sx={modeNameSx}>
        Construction
      </Typography>
      <Box sx={buttonsGridSx}>
        <ButtonBase
          sx={{ ...itemButtonSx, ...makeStylesForBtn("wall") }}
          onClick={onWallBtnClicked}
        >
          <img src="/icons/wall.png" alt="wall" style={iconSx} />
          <Typography sx={buttonTextSx}>Wall</Typography>
        </ButtonBase>
        <ButtonBase
          sx={{ ...itemButtonSx, ...makeStylesForBtn("window") }}
          onClick={onWindowBtnClicked}
        >
          <img src="/icons/window.png" alt="window" style={iconSx} />
          <Typography sx={buttonTextSx}>Window</Typography>
        </ButtonBase>
        <ButtonBase
          sx={{ ...itemButtonSx, ...makeStylesForBtn("door") }}
          onClick={onDoorBtnClicked}
        >
          <img src="/icons/door.png" alt="door" style={iconSx} />
          <Typography sx={buttonTextSx}>Door</Typography>
        </ButtonBase>
      </Box>
    </>
  );
};

export default ConstructionMode;
