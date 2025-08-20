import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import refreshToken from "../utils/refreshToken";
export default function Home() {
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    useEffect(async () => {
        try {
            const res = await axiosInstance.get("/auth/email");
            setEmail(res.data.email);
        } catch (error) {
            if (error.response.status === 401) {
                navigate("/login");
            }
            if (error.response.status === 403) {
                try {
                    const newRes = await refreshToken();
                    setEmail(newRes.data.email);
                } catch (error) {
                    navigate("/login");
                }
            }
        }
    }, []);

    return (
        <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-100 via-teal-50 to-cyan-100">
            <div className="rounded-2xl bg-white px-10 py-12 shadow-xl">
                <h1 className="text-3xl font-bold text-gray-800">Hi</h1>
                <h1>hello {email}</h1>
                <p className="mt-2 text-gray-600">Welcome to your dashboard.</p>
                user ? ( ) : (<span className="text-gray-600">{user.name}</span>
                )
                <button className="mt-4 rounded bg-blue-500 px-4 py-2 text-white">
                    Logout
                </button>
            </div>
        </main>
    );
}
