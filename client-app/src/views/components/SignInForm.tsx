import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  Backdrop,
  Fade
} from "@mui/material";
import React, { useState } from "react";
import { AuthService } from "../../business_logic/concrete/auth";

interface SignInFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  authService: AuthService;
}

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  bgcolor: "#f5f5f5",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  outline: "none"
};

const backdropStyle = {
  backdropFilter: "blur(4px)",
  backgroundColor: "rgba(0,0,0,0.3)"
};

const initialForm = {
  email: "",
  password: ""
};

const fieldStyle = { mb: 2, backgroundColor: "#fff" };

const SignInForm: React.FC<SignInFormProps> = ({
  open,
  onClose,
  onSuccess,
  authService
}) => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const renderTextField = (
    name: "email" | "password",
    label: string,
    type: string
  ) => (
    <TextField
      label={label}
      name={name}
      type={type}
      value={form[name]}
      onChange={handleChange}
      fullWidth
      required
      sx={fieldStyle}
    />
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authService.signIn(form.email, form.password);
      setForm(initialForm);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500, sx: backdropStyle } }}
    >
      <Fade in={open}>
        <Box component="form" onSubmit={handleSubmit} sx={style}>
          <Typography variant="h6" sx={{ mb: 2, color: "#1976d2" }}>
            Sign In
          </Typography>
          {renderTextField("email", "Email", "email")}
          {renderTextField("password", "Password", "password")}
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{
              backgroundColor: "#1976d2",
              color: "#fff",
              "&:hover": { backgroundColor: "#1565c0" }
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
};

export default SignInForm;
