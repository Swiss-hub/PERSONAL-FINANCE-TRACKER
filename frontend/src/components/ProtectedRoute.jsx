import { useConext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

function ProtectedRoute({ children }) {
    const { token } = useContext(AuthConext);

    if (!token) {
        return <Navigate to="/Login" replace />;
    }
    return children;
}

export default ProtectedRoute;