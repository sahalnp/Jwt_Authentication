import React from "react";
import axiosInstance from "../axios/axiosInstance";
import { setUser } from "../features/userSlice";
import showToast from "../utils/showToast";
import { useDispatch } from "react-redux";

export default function Login() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const dispatch = useDispatch();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axiosInstance.post("/auth/login", {
                email,
                password,
            });
            dispatch(setUser(response.data.user));
        } catch (error) {
           showToast();
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            className="w-full max-w-sm space-y-6 rounded-2xl bg-white p-8 shadow-xl"
            onSubmit={handleSubmit}
        >
            <h1 className="text-center text-2xl font-bold text-gray-800">
                Welcome back
            </h1>

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

            <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                    <input type="checkbox" className="mr-2 accent-indigo-600" />
                    Remember me
                </label>
            </div>

            <button
                type="submit"
                className="w-full rounded-lg bg-indigo-600 py-2.5 font-semibold text-white shadow-md hover:bg-indigo-700"
            >
                {loading ? "Loading..." : "Sign In"}
            </button>

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
