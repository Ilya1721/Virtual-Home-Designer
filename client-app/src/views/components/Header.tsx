import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React from "react";
import { AuthService } from "../../business_logic/concrete/auth";
import { GlobalContext } from "../../Main";

const buttonStyle = {
  borderColor: "#90caf9",
  color: "#1976d2",
  backgroundColor: "#e3f2fd",
  mr: 1,
  minWidth: 120,
  "&:hover": { backgroundColor: "#bbdefb" },
};

interface HeaderProps {
  onSignUp?: () => void;
  onSignIn?: () => void;
  authService: AuthService;
}

const Header: React.FC<HeaderProps> = ({ onSignUp, onSignIn, authService }) => {
  const { user } = React.useContext(GlobalContext);

  const handleSignOut = async () => {
    if (user && user.id) {
      await authService.signOut(user.id);
    }
  };

  const renderButton = (label: string, onClick: () => void, extraSx = {}) => (
    <Button
      color="primary"
      variant="outlined"
      sx={{ ...buttonStyle, ...extraSx }}
      onClick={onClick}
    >
      {label}
    </Button>
  );

  return (
    <AppBar
      position="absolute"
      sx={{ backgroundColor: "rgba(0, 0, 0, 0)", color: "#333", boxShadow: "none" }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, color: "#333" }}>
          Virtual Home Designer
        </Typography>
        <Box>
          {!user && renderButton("Sign In", onSignIn)}
          {!user && renderButton("Sign Up", onSignUp, { mr: 0 })}
          {user && renderButton("Sign Out", handleSignOut, { mr: 0 })}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
