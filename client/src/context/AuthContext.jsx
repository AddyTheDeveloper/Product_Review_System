import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        // Check if user is logged in on mount
        const checkLoggedIn = async () => {
            const storedUser = localStorage.getItem('user');
            const storedToken = localStorage.getItem('token');

            if (storedUser && storedToken) {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
                // Set default headers
                axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            }
            setLoading(false);
        };

        checkLoggedIn();
    }, []);

    const register = useCallback(async (userData) => {
        setError(null);
        try {
            const res = await axios.post('/api/auth/register', userData);
            const { token, user } = res.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setToken(token);
            setUser(user);
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Registration failed';
            setError(message);
            return { success: false, message };
        }
    }, []);

    const login = useCallback(async (userData) => {
        setError(null);
        try {
            const res = await axios.post('/api/auth/login', userData);
            const { token, user } = res.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setToken(token);
            setUser(user);
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Login failed';
            setError(message);
            return { success: false, message };
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        setToken(null);
        setUser(null);
    }, []);

    const isAdmin = user?.role === 'admin';

    const value = useMemo(() => ({
        user,
        token,
        loading,
        error,
        register,
        login,
        logout,
        isAdmin
    }), [user, token, loading, error, register, login, logout, isAdmin]);

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
