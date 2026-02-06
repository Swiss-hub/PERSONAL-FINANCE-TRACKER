import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch("http://localhost:8000/api/token/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
                }
            );
        

            if (!response.ok) {
                throw new Error("Invalid credentials");
            } 

            const data = await response.json();
            login(data.access, data.refresh);
            navigate("/dashboard");

        } catch (error) {
            alert(error.message);
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

            <br/>
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <br/>
            <button type="submit">Login</button>

        </form>
    );

    
};

export default Login;





































// THIS IS THE PREVIOUS CODE BEFORE BACKEND INTEGRATION


//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         // Simulate an API call

//         // TEMPORARY: In a real app, you'd get the token from the server
//         // Replace with Django API later
//         if (username === "admin" && password === "admin") {
//             login("dummy-jwt-token");
//             navigate("/dashboard");
//         }
//     };

//     return(
//         <form onSubmit={handleSubmit}>
//             <h2>Login</h2>

//             <input
//                 type="text"
//                 placeholder="Username"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//             />

//             <button type="submit">Login</button>
//         </form>
//     );
// }
// export default Login;