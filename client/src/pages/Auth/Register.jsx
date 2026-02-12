import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/UI/Input';
import { useAuth } from '../../context/AuthContext';
import styles from './Auth.module.css';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        const result = await register({
            name: formData.name,
            email: formData.email,
            password: formData.password
        });

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
                <h1 className={styles.title}>Create Account</h1>
                <p className={styles.subtitle}>Join Reviewly today</p>

                {error && <div style={{ color: 'var(--color-error)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <Input
                        label="Full Name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
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
                    <Input
                        label="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit" className={`glass-button ${styles.button}`} disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <p className={styles.footer}>
                    Already have an account?
                    <Link to="/login" className={styles.link}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
