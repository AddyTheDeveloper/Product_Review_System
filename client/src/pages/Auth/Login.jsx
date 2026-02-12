import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/UI/Input';
import { useAuth } from '../../context/AuthContext';
import styles from './Auth.module.css';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(formData);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <div className={styles.container}>
            <div className={`glass-card ${styles.authCard} animate-fade-in`}>
                <h1 className={styles.title}>Welcome Back</h1>
                <p className={styles.subtitle}>Sign in to continue to Reviewly</p>

                {error && <div style={{ color: 'var(--color-error)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <Input
                        label="Email Address"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit" className={`glass-button ${styles.button}`} disabled={loading}>
                        {loading ? 'Signing In...' : 'Login'}
                    </button>
                </form>

                <p className={styles.footer}>
                    Don't have an account?
                    <Link to="/register" className={styles.link}>Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
