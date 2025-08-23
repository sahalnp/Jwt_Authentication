import React from "react";
import LoginPage from "../pages/login";
import SignupPage from "../pages/signup";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PrivateRouter from "./PrivateRouter";
import PublicRoute from "./PublicRouter";
import Home from "../pages/home";
import GoogleSuccess from "../components/googleSuccess";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <PrivateRouter>
                <Home />
            </PrivateRouter>
        ),
    },
    {
        path: "/login",
        element: (
            <PublicRoute>
                <LoginPage />
            </PublicRoute>
        ),
    },
    {
        path: "/signup",
        element: (
            <PublicRoute>
                <SignupPage />
            </PublicRoute>
        ),
    },
    {
        path: "/auth/google/success",
        element: <GoogleSuccess />,
    },
]);

export const MainRouter = () => {
    return <RouterProvider router={router} />;
};
