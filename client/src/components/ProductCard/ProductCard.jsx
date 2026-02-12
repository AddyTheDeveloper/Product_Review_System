import React from 'react';
import { Link } from 'react-router-dom';
import StarRating from '../StarRating/StarRating';
import styles from './ProductCard.module.css';

const ProductCard = ({ product }) => {
    return (
        <Link to={`/products/${product.id}`} className={`glass-card ${styles.card}`}>
            <div className={styles.imageContainer}>
                {/* Placeholder image logic */}
                <img
                    src={product.image || `https://via.placeholder.com/300?text=${product.name}`}
                    alt={product.name}
                    className={styles.image}
                />
                <div className={styles.overlay}>
                    <button className="glass-button">View Details</button>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.header}>
                    <h3 className={styles.title}>{product.name}</h3>
                    <span className={styles.price}>{product.price > 0 ? `₹${product.price}` : 'N/A'}</span>
                </div>

                <p className={styles.description}>
                    {product.description?.substring(0, 60)}...
                </p>

                <div className={styles.footer}>
                    <StarRating rating={product.averageRating || 0} />
                    <span className={styles.reviews}>({product.reviewCount || 0} reviews)</span>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
