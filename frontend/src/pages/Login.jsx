import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Simulate an API call

        // TEMPORARY: In a real app, you'd get the token from the server
        // Replace with Django API later
        if (username === "admin" && password === "admin") {
            login("dummy-jwt-token");
            navigate("/Dashboard");
        }
    };

    return(
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <button type="submit">Login</button>
        </form>
    );
}

export default Login;