import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = location.state?.from || "/";

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("https://localhost:7136/api/Authentication/Login", {
                email,
                password,
            });
            localStorage.setItem("token", response.data.token); // Save JWT
            console.log(response.data.token)
            navigate(redirectTo); // Redirect to the page where the user came from
        } catch (err) {
            setError("Invalid login credentials.");
        }
    };

    const handleRegisterRedirect = () => {
        navigate("/register", { state: { from: redirectTo } });
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit">Login</button>
            </form>
            <button onClick={handleRegisterRedirect}>Register</button>
        </div>
    );
};

export default Login;
