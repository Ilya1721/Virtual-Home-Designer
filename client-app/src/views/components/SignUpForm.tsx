import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  Backdrop,
  Fade,
  MenuItem,
} from "@mui/material";
import React, { useState } from "react";
import { CreateUserDTO, UserRole } from "shared-types";
import { AuthService } from "../../business_logic/concrete/auth";

interface SignUpFormProps {
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
  outline: "none",
};

const backdropStyle = {
  backdropFilter: "blur(4px)",
  backgroundColor: "rgba(0,0,0,0.3)",
};

const initialForm: CreateUserDTO = {
  email: "",
  password: "",
  nickname: "",
  role: UserRole.USER,
};

const fieldStyle = { mb: 2, backgroundColor: "#fff" };

const SignUpForm: React.FC<SignUpFormProps> = ({
  open,
  onClose,
  onSuccess,
  authService,
}) => {
  const [form, setForm] = useState<CreateUserDTO>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const renderTextField = (
    name: keyof CreateUserDTO,
    label: string,
    type = "text",
    extraProps: object = {}
  ) => (
    <TextField
      label={label}
      name={name}
      type={type}
      value={form[name] as string}
      onChange={handleChange}
      fullWidth
      required
      sx={fieldStyle}
      {...extraProps}
    />
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authService.signUp(form);
      setForm(initialForm);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.message || "Registration failed");
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
            Sign Up
          </Typography>
          {renderTextField("email", "Email", "email")}
          {renderTextField("password", "Password", "password")}
          {renderTextField("nickname", "Nickname")}
          <TextField
            select
            label="Role"
            name="role"
            value={form.role}
            onChange={handleChange}
            fullWidth
            sx={fieldStyle}
            required
          >
            {Object.values(UserRole).map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>
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
              "&:hover": { backgroundColor: "#1565c0" },
            }}
          >
            {loading ? "Registering..." : "Sign Up"}
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
};

export default SignUpForm;
