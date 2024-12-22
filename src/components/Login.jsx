import {
  IconButton,
  OutlinedInput,
  InputLabel,
  InputAdornment,
  FormControl,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import Cookie from "js-cookie";
import { Form, json, redirect, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const formData = Object.fromEntries(form.entries());
    console.log(formData);
    const newObject = {
      username: formData.username,
      password: formData.password,
    };
    try {
      const res = await fetch(
        "https://backend.ankitkumar143872.workers.dev/api/v1/user/signin",
        {
          method: e.target.method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newObject),
        }
      );

      if (!res.ok) {
        toast.error("Wrong Phone Number or Password", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        return;
      }
      const resData = await res.json();
      console.log(resData);
      const name = resData.name;
      const token = resData.token;
      const id = resData.id;

      Cookie.set("uuid", token);
      Cookie.set("name", name);

      navigate(`/${id}`);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }
  };

  return (
    <section id="login">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <div className="login-form">
        <form method="post" onSubmit={handleSubmit}>
          <div>
            <TextField
              label="Phone Number"
              id="outlined-start-adornment"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">+91 </InputAdornment>
                ),
              }}
              name="username"
              required
            />
          </div>
          <div>
            <FormControl required sx={{ marginTop: 1 }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <OutlinedInput
                name="password"
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label=" Password"
              />
            </FormControl>
          </div>
          <button type="submit" className="">
            Login
          </button>
        </form>
      </div>
    </section>
  );
}
