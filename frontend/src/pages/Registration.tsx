import { useEffect, useState } from "react";
import axiosApi from "../lib/axiosApi";

import "bootstrap/dist/css/bootstrap.min.css";
import registrationCover from "../assets/images/registrationCover.jpeg";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function RegistrationPage() {
  // when page loads, check if token is valid, else redirect
  // employee click tokenLink, http://localhost:3000/registration/b09a5903d0341aa5e47b31c3264729e3

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [valid, setValid]     = useState(false);

  // pull token from url
  const token = window.location.href.split("/").pop();
  // useEffect(() => {
  //   const validateToken = async () => {
  //     // const response = await fetch(
  //     //   `http://localhost:8080/api/tokens/validate/${token}`
  //     // );
  //     // const data = await response.json();
  //     const response = await axiosApi.get<{ valid: boolean}>(`/api/tokens/validate/${token}`);
  //     const data = response.data;

  //     if (!data || !data.valid) {
  //       // window.location.href = "http://localhost:3000/";
  //       window.location.href = process.env.REACT_APP_API_URL || "/";
  //     }
  //   };

  //   validateToken();
  // }, [token]);

  useEffect(() => {
    const checkToken = async () => {
      try {
        // now, “validate” → “check”
        const res = await axiosApi.get<{ valid: boolean; email: string }>(
          `/api/tokens/check/${token}`
        );
        // pre-fill the email:
        setFormData(f => ({ ...f, email: res.data.email }));
        setValid(true);
      } catch (e: any) {
        setError(e.response?.data?.error || "Invalid or expired link.");
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, [token]);

  type FormData = {
    email: string;
    userName: string;
    password: string;
    token: string;
  };

  const [formData, setFormData] = useState<FormData>({
    email: "",
    userName: "",
    password: "",
    token: token || "",
  });

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // const handleSubmit = async (e: any) => {
  //   e.preventDefault();

  //   // send form data to backend to register
  //   // const response = await axios.post(
  //   //   "http://localhost:8080/api/auth/register",
  //   //   formData,
  //   //   {
  //   //     headers: {
  //   //       "Content-Type": "application/json",
  //   //     },
  //   //   }
  //   // );
  //   const response = await axiosApi.post("/api/auth/register", formData, {
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });

  //   const data = await response.data;

  //   if (data.success) {
  //     navigate("/login");
  //   }
  // };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      // when they actually register, consume/mark-used
      await axiosApi.post(
        "api/auth/register",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );
      navigate("/login");
    } catch (e: any) {
      // show validation error if e.g. token expired mid-form
      toast.error(e.response?.data?.error || "Registration failed.");
    }
  };

  if (loading) {
    return <p>Checking registration link…</p>;
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  return (
    <div
      className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light"
      style={{
        backgroundImage: `url(${registrationCover})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="row h-50 border rounded shadow text-center text-white"
        style={{
          background:
            "transparent linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.5))",
          backdropFilter: "blur(5px)",
        }}
      >
        {/* Left */}
        <div className="col-md-6 d-flex flex-column align-items-center justify-content-center">
          <h2 className="fw-bold">Welcome to Registration</h2>
          <p className="lead">
            To Keep onboarding simple, please click the button below to
            register.
          </p>
        </div>

        {/* Right */}
        <div className="col-md-6 d-flex align-items-center">
          <form
            className="form-control p-3"
            style={{
              background: "transparent",
            }}
          >
            <label htmlFor="email" className="form-label"></label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              autoComplete="off"
            />
            <label htmlFor="userName" className="form-label"></label>
            <input
              type="text"
              id="userName"
              name="userName"
              placeholder="Username"
              value={formData.userName}
              className="form-control"
              onChange={handleChange}
              autoComplete="off"
            />
            <label htmlFor="password" className="form-label"></label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              autoComplete="off"
            />
            <button
              type="submit"
              className="btn btn-primary mt-3 w-100"
              onClick={handleSubmit}
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
