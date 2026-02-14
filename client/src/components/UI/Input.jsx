import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import styles from './Input.module.css';

const Input = ({ label, type = 'text', startAdornment, ...props }) => {
    const [focused, setFocused] = useState(false);
    const [value, setValue] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    const handleFocus = () => setFocused(true);
    const handleBlur = (e) => {
        if (!e.target.value) setFocused(false);
    };
    const handleChange = (e) => {
        setValue(e.target.value);
        if (props.onChange) props.onChange(e);
    };

    const hasValue = props.value !== undefined && props.value !== null && props.value !== '';
    const isActive = focused || hasValue || value;

    return (
        <div className={styles.inputContainer}>
            {startAdornment && (
                <span className={styles.startAdornment} style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-30%)', // Adjusted for input padding
                    color: 'rgba(255,255,255,0.6)',
                    zIndex: 1,
                    pointerEvents: 'none'
                }}>
                    {startAdornment}
                </span>
            )}

            {type === 'select' ? (
                <select
                    className={`glass-input ${styles.input}`}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    style={startAdornment ? { paddingLeft: '2.5rem' } : {}}
                    {...props}
                >
                    {props.children}
                </select>
            ) : (
                <input
                    className={`glass-input ${styles.input}`}
                    type={inputType}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    style={startAdornment ? { paddingLeft: '2.5rem' } : {}}
                    {...props}
                />
            )}

            <label className={`${styles.label} ${isActive ? styles.active : ''}`} style={startAdornment && !isActive ? { left: '2.5rem' } : {}}>
                {label}
            </label>

            {isPassword && (
                <button
                    type="button"
                    className={styles.toggleBtn}
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            )}
        </div>
    );
};

export default Input;
