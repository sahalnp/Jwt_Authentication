import React from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axios/axiosInstance";
import showToast from "../utils/showToast";

export default function Signup() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showToast("Passwords do not match!", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/signup", {
        name,
        email,
        password,
      });

      setLoading(false);

      if (response.data.success) {
        showToast(response.data.message);
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        showToast(response.data.message );
      }
    } catch (error) {
      setLoading(false);
      showToast(
        error.response?.data?.message
      );
    }
  };

  return (
    <form
      className="w-full max-w-sm space-y-6 rounded-2xl bg-white p-8 shadow-xl"
      onSubmit={handleSubmit}
    >
      <h1 className="text-center text-2xl font-bold text-gray-800">
        Create your account
      </h1>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          onChange={(e) => setName(e.target.value)}
          type="text"
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Confirm password
        </label>
        <input
          type="password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <label className="flex items-center text-sm">
        <input type="checkbox" required className="mr-2 accent-indigo-600" />
        I agree to the{" "}
        <a
          href="#"
          className="ml-1 font-semibold text-indigo-600 hover:underline"
        >
          terms & conditions
        </a>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-indigo-600 py-2.5 font-semibold text-white shadow-md hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Account"}
      </button>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <a
          href="/login"
          onClick={(e) => {
            e.preventDefault();
            navigate("/login");
          }}
          className="font-semibold text-indigo-600 hover:underline"
        >
          Sign In
        </a>
      </p>
    </form>
  );
}
