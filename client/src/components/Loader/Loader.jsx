import React from 'react';
import styles from './Loader.module.css';

const Loader = () => {
    return (
        <div className={styles.container}>
            <div className={styles.spinner}>
                <div className={styles.blob}></div>
            </div>
            <p className="animate-pulse">Loading...</p>
        </div>
    );
};

export default Loader;
