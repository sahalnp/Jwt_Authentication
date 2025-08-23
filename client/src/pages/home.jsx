import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "../axios/axiosInstance";
import showToast from "../utils/showToast";
import { setUser, clearUser } from "../features/userSlice";

export default function Home() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Logout handler
  const handleLogout = async () => {
    try {
      const res = await axiosInstance.post("/auth/logout", null, {
        withCredentials: true,
      });
      dispatch(clearUser());
      showToast(res.data.message || "Logged out successfully", "success");
      navigate("/login");
    } catch (error) {
      showToast(
        error.response?.data?.message || "Something went wrong",
        "error"
      );
    }
  };

  // Fetch current user from backend (after Google login)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/auth/current-user", {
          withCredentials: true,
        });
        console.log(res.data.user);

        if (res.data.user) {
          dispatch(setUser(res.data.user)); 
        } else {
          navigate("/login");
        }
      } catch (err) {
        showToast("Please login to continue", "error");
        dispatch(clearUser());
        navigate("/login");
      }
    };

    if (!user) {
      fetchUser();
    }
  }, [dispatch, navigate, user]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-100 via-teal-50 to-cyan-100">
      <div className="rounded-2xl bg-white px-10 py-12 shadow-xl">
        <h1 className="text-3xl font-bold text-gray-800">
          Hi {user?.email || "Guest"}
        </h1>
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
