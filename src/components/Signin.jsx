import TextField from "@mui/material/TextField";
import { Form } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import Cookie from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CircularProgress, Backdrop } from "@mui/material";


export default function Signin() {
  const navigate = useNavigate();

  const { signIn } = useAuth();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const [value, setValue] = useState("one");

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading((prev) => !prev);

    const form = new FormData(event.target);
    form.append("role", "1");
    const formData = Object.fromEntries(form.entries());

    fetch(
      `https://backend.ankitkumar143872.workers.dev/api/v1/user/signin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    )
      .then(async (res) => {
        if (!res.ok) {
          toast.error("Invalid Email or Password", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setLoading((prev) => !prev);
          return;
        }

        const resData = await res.json();
        signIn(resData);

        Cookie.set("uuid", resData.token);
        Cookie.set("name", resData.name);
        setLoading((prev) => !prev);
        console.log("Navigating to /admin/details");
        navigate("/admin/details");
      })
      .catch((err) => {
        toast.error(err, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        setLoading((prev) => !prev);
      });
  };

  return (
    <>
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
        theme="light"
      />

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress />
      </Backdrop>

      <div className="account">
        <div className="account-summ account-ui view ">
          <div>
            <img src="static/images/logo1.png.jpeg" alt="" />
            <p className="text-2xl font-semibold text-center text-white">
               GANDHI INSTITUTE OF TECHNICAL ADVANCEMENT
            </p>
            <p className="text-4xl font-bold text-center text-white">
               AUTONOMOUS COLLEGE, BHUBANESWAR
            </p>
          </div>
        </div>
        
        <div className="account-summ account-form">
          <Form className="form-signin" method="post" onSubmit={handleSubmit}>
            <div>
              <h1 style={{ fontSize: 20 }}>Login as supervisor</h1>
            </div>
            <TextField
              sx={{ margin: 1 }}
              fullWidth
              id="outlined-basic"
              name="username"
              label="Mobile Number"
              variant="outlined"
            />
            <TextField
              sx={{ margin: 1 }}
              id="outlined-password-input"
              label="Password"
              type="password"
              name="password"
              autoComplete="current-password"
              fullWidth
            />
            <div>
              <a href="/login">Login as cleaner</a>
            </div>

            <button type="submit" className="sign-btn">
              Sign in
            </button>
          </Form>
        </div>
      </div>
    </>
  );
}
