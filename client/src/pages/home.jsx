import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "../axios/axiosInstance";
import refreshToken from "../utils/refreshToken";
import showToast from "../utils/showToast";
import { clearUser } from "../features/userSlice";

export default function Home() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post("/auth/logout");
      dispatch(clearUser());
      showToast(response.data.message || "Logged out successfully", "success");
      navigate("/login");
    } catch (error) {
      showToast(
        error.response?.data?.message || "Something went wrong",
        "error"
      );
    }
  };

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const res = await axiosInstance.get("/auth/email");
        setEmail(res.data.email);
      } catch (error) {
        if (error.response?.status === 401) {
          showToast("Unauthorized. Please login.", "error");
          dispatch(clearUser());
          navigate("/login");
        } else if (error.response?.status === 403) {
          try {
            await refreshToken();
            const res = await axiosInstance.get("/auth/email");
            setEmail(res.data.email);
          } catch (err) {
            showToast("Session expired. Please login again.", "error");
            dispatch(clearUser());
            navigate("/login");
          }
        } else {
          showToast("Something went wrong", "error");
        }
      }
    };

    fetchEmail();
  }, [dispatch, navigate]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-100 via-teal-50 to-cyan-100">
      <div className="rounded-2xl bg-white px-10 py-12 shadow-xl">
        <h1 className="text-3xl font-bold text-gray-800">Hi {email}</h1>
        <h2 className="mt-1 text-gray-700">{user?.name}</h2>
        <p className="mt-2 text-gray-600">Welcome to your dashboard.</p>
        <button
          className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </main>
  );
}
