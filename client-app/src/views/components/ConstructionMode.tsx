import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { ConstructionModeSelector } from "../../frontend_components/concrete/Babylon/components/ConstructionModeSelector";
import { FloorMode } from "../../frontend_components/concrete/Babylon/components/FloorMode";
import { WallMode } from "../../frontend_components/concrete/Babylon/components/WallMode";
import { GlobalContext } from "../../Main";

const iconSx: React.CSSProperties = {
  width: 32,
  height: 32,
  objectFit: "contain"
};

const buttonTextSx: React.CSSProperties = {
  marginTop: 1,
  fontSize: 12,
  color: "#000"
};

const itemButtonSx = {
  display: "flex",
  flexDirection: "column",
  padding: 1,
  borderRadius: 2
};

const buttonsGridSx: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 2,
  margin: 1
};

const modeNameSx: React.CSSProperties = {
  margin: 1,
  paddingLeft: 2,
  fontSize: 16,
  fontWeight: 600
};

const ConstructionMode: React.FC = () => {
  const { scene, activeMode, setActiveMode } = React.useContext(GlobalContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const constructionModeSelector = React.useMemo(() => {
    if (scene) {
      return new ConstructionModeSelector(scene);
    }
  }, [scene]);
  const wallMode = React.useRef(null);
  const floorMode = React.useRef(null);

  useEffect(() => {
    if (!scene || !constructionModeSelector) {
      return;
    }

    if (wallMode.current) {
      wallMode.current.dispose();
      wallMode.current = null;
    }

    if (floorMode.current) {
      floorMode.current.dispose();
      floorMode.current = null;
    }

    switch (activeMode) {
      case "wall":
        wallMode.current = new WallMode(scene);
        constructionModeSelector.setMode(wallMode.current);
        break;
      case "floor":
        floorMode.current = new FloorMode(scene);
        constructionModeSelector.setMode(floorMode.current);
        break;
      case "window":
        constructionModeSelector.setMode(null);
        break;
      case "door":
        constructionModeSelector.setMode(null);
        break;
    }
  }, [activeMode, scene, constructionModeSelector]);

  useEffect(() => {
    return () => {
      if (wallMode.current) {
        wallMode.current.dispose();
        wallMode.current = null;
      }
      if (floorMode.current) {
        floorMode.current.dispose();
        floorMode.current = null;
      }
      constructionModeSelector?.setMode(null);
    };
  }, [constructionModeSelector]);

  const makeStylesForBtn = (mode: string) => {
    const isActive = activeMode === mode;
    return {
      backgroundColor: isActive ? "#cfcfcfff" : "inherit",
      "&:hover": { backgroundColor: isActive ? "#cfcfcfff" : "inherit" }
    };
  };

  const activateMode = (mode: string) => {
    if (mode === activeMode) {
      setActiveMode("none");
      constructionModeSelector?.setMode(null);
    } else {
      setActiveMode(mode);
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

  const onFloorBtnClicked = () => {
    activateMode("floor");
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center"
        }}
      >
        <ButtonBase
          sx={{
            padding: 0,
            borderRadius: 0
          }}
          disableRipple
          disableTouchRipple
          onClick={toggleExpanded}
        >
          <img
            src="/icons/up-arrow.png"
            alt="toggle"
            style={{
              width: 24,
              height: 24,
              objectFit: "contain",
              transform: isExpanded ? "scaleY(-1)" : "scaleY(1)"
            }}
          />
        </ButtonBase>
      </Box>
      {isExpanded && (
        <Box sx={buttonsGridSx}>
          <ButtonBase
            sx={{ ...itemButtonSx, ...makeStylesForBtn("floor") }}
            onClick={onFloorBtnClicked}
          >
            <img src="/icons/floor.png" alt="floor" style={iconSx} />
            <Typography sx={buttonTextSx}>Floor</Typography>
          </ButtonBase>
        </Box>
      )}
    </>
  );
};

export default ConstructionMode;
