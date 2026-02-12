import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import styles from './Input.module.css';

const Input = ({ label, type = 'text', ...props }) => {
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

    return (
        <div className={styles.inputContainer}>
            <input
                className={`glass-input ${styles.input}`}
                type={inputType}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
                {...props}
            />
            <label className={`${styles.label} ${focused || value || props.value ? styles.active : ''}`}>
                {label}
            </label>

            {isPassword && (
                <button
                    type="button"
                    className={styles.toggleBtn}
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1" // Prevent tab focus
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            )}
        </div>
    );
};

export default Input;
