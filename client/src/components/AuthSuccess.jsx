import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../features/userSlice";
import axiosInstance from "../axios/axiosInstance";
import { useNavigate } from "react-router-dom";

const Success = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axiosInstance.get("/auth/current-user");
                dispatch(setUser(res.data.user));
                navigate("/");
            } catch (err) {
                navigate("/login");
            }
        };

        fetchUser();
    }, []);

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
    );
};

export default Success;
