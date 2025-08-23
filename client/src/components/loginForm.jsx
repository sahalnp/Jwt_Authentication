import React from "react";
import axiosInstance from "../axios/axiosInstance";
import { setUser } from "../features/userSlice";
import showToast from "../utils/showToast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Normal email/password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        dispatch(setUser(response.data.User));
        showToast(response.data.message || "Logged in successfully", "success");
        setTimeout(() => navigate("/"), 500);
      } else {
        showToast(response.data.message || "Login failed", "error");
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };
  const handleGithubLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/github";
  };

  return (
    <form
      className="w-full max-w-sm space-y-6 rounded-2xl bg-white p-8 shadow-xl"
      onSubmit={handleSubmit}
    >
      <h1 className="text-center text-2xl font-bold text-gray-800">
        Welcome back
      </h1>

      {/* Email */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Password */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Remember me */}
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center">
          <input type="checkbox" className="mr-2 accent-indigo-600" />
          Remember me
        </label>
      </div>

      {/* Sign in button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-indigo-600 py-2.5 font-semibold text-white shadow-md hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "Loading..." : "Sign In"}
      </button>

      {/* OAuth providers */}
      <div className="flex flex-col gap-3 mt-4">
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full rounded-lg border border-gray-300 py-2 bg-white hover:bg-gray-100"
        >
          <span className="mr-2">
            {/* Google SVG */}
            <svg width="20" height="20" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.72 1.22 9.22 3.22l6.9-6.9C35.64 2.34 30.13 0 24 0 14.73 0 6.41 5.48 2.44 13.44l8.06 6.27C12.7 13.16 17.89 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.5c0-1.64-.15-3.22-.43-4.75H24v9.02h12.44c-.54 2.9-2.16 5.36-4.6 7.02l7.18 5.59C43.99 37.36 46.1 31.36 46.1 24.5z"/><path fill="#FBBC05" d="M10.5 28.73c-1.13-3.36-1.13-6.97 0-10.33l-8.06-6.27C.64 16.36 0 20.07 0 24c0 3.93.64 7.64 2.44 11.27l8.06-6.27z"/><path fill="#EA4335" d="M24 48c6.13 0 11.64-2.02 15.9-5.5l-7.18-5.59c-2.01 1.35-4.59 2.14-7.72 2.14-6.11 0-11.3-3.66-13.5-8.71l-8.06 6.27C6.41 42.52 14.73 48 24 48z"/></g></svg>
          </span>
          <span>Sign in with Google</span>
        </button>

        <button
          type="button"
          onClick={handleGithubLogin}
          className="flex items-center justify-center w-full rounded-lg border border-gray-300 py-2 bg-white hover:bg-gray-100"
        >
          <span className="mr-2">
            {/* GitHub SVG */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.477 2 2 6.484 2 12.012c0 4.428 2.865 8.184 6.839 9.525.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.34-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.254-.446-1.274.098-2.656 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.747-1.025 2.747-1.025.546 1.382.202 2.402.1 2.656.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.579.688.481C19.138 20.192 22 16.44 22 12.012 22 6.484 17.523 2 12 2z" fill="#181717"/></svg>
          </span>
          <span>Sign in with GitHub</span>
        </button>
      </div>

      <p className="text-center text-sm text-gray-500">
        New here?{" "}
        <a
          href="/signup"
          className="font-semibold text-indigo-600 hover:underline"
        >
          Create an account
        </a>
      </p>
    </form>
  );
}
