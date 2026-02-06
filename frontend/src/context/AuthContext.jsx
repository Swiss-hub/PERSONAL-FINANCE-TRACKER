import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => {
        return localStorage.getItem("token");
    });

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);

    const login = (accessToken, refreshToken) => {
        localStorage.setItem("token", accessToken);
        if (refreshToken) {
            localStorage.setItem("refresh_token", refreshToken);
        }
        setToken(accessToken);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}




// import { createContext, useState, useEffect } from "react";


// export function AuthProvider({ children }) {
//     const [token, setToken] = useState(null);

//     useEffect(() => {
//         const storedToken = localStorage.getItem("token");
//         if (storedToken) {
//             setToken(storedToken);
//         }
//     }, []);

//     const login = (accessToken) => {
//         localStorage.setItem("token", accessToken);
//         setToken(accessToken);
//     };

//     const logout = () => {
//         localStorage.removeItem("token");
//         setToken(null);
//     };

//     return(
//         <AuthContext.Provider value={{ token, login, logout }}>
//         {children}
//         </AuthContext.Provider>
//     );
// }

// export const AuthContext = createContext();