import { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './AdminDashboard.module.css'; // Reusing dashboard styles for consistency

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('category'); // 'category' or 'all'

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('/api/admin/products');
            setProducts(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    // Group products by category
    const groupedProducts = products.reduce((acc, product) => {
        const category = product.category || 'Uncategorized';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(product);
        return acc;
    }, {});

    if (loading) {
        return (
            <div className={styles.container} style={{ justifyContent: 'center', alignItems: 'center' }}>
                <div className="loader">Loading Products...</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <main className={styles.content} style={{ marginLeft: 0, width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
                <header className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Link to="/admin" className={styles.iconButton} title="Back to Dashboard">
                            <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} />
                        </Link>
                        <h2>Product Inventory</h2>
                    </div>
                    <div className={styles.filters}>
                        <button
                            className={`${styles.iconButton} ${viewMode === 'category' ? styles.active : ''}`}
                            onClick={() => setViewMode('category')}
                            title="Group by Category"
                        >
                            <LayoutGrid size={20} />
                        </button>
                        <button
                            className={`${styles.iconButton} ${viewMode === 'all' ? styles.active : ''}`}
                            onClick={() => setViewMode('all')}
                            title="Show All"
                        >
                            <List size={20} />
                        </button>
                    </div>
                </header>

                {viewMode === 'category' ? (
                    Object.keys(groupedProducts).map(category => (
                        <div key={category} className={`glass-panel ${styles.tableContainer}`} style={{ marginBottom: '2rem' }}>
                            <div className={styles.sidebarHeader} style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <h3 style={{ margin: 0, color: 'var(--color-primary)' }}>{category} ({groupedProducts[category].length})</h3>
                            </div>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Product Name</th>
                                        <th>Brand</th>
                                        <th>Type</th>
                                        <th>Avg Rating</th>
                                        <th>Reviews</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groupedProducts[category].map(product => (
                                        <tr key={product._id}>
                                            <td>
                                                <Link to={`/products/${product._id}`} style={{ color: 'inherit', textDecoration: 'none', fontWeight: '500' }}>
                                                    {product.name}
                                                </Link>
                                            </td>
                                            <td>{product.brand}</td>
                                            <td>{product.productType}</td>
                                            <td>{product.averageRating?.toFixed(1)} ★</td>
                                            <td>{product.reviewCount}</td>
                                            <td>
                                                <Link to={`/products/${product._id}`} className={styles.iconButton}>
                                                    <Package size={18} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))
                ) : (
                    <div className={`glass-panel ${styles.tableContainer}`}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Product Name</th>
                                    <th>Category</th>
                                    <th>Brand</th>
                                    <th>Type</th>
                                    <th>Avg Rating</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product._id}>
                                        <td>
                                            <Link to={`/products/${product._id}`} style={{ color: 'inherit', textDecoration: 'none', fontWeight: '500' }}>
                                                {product.name}
                                            </Link>
                                        </td>
                                        <td>{product.category}</td>
                                        <td>{product.brand}</td>
                                        <td>{product.productType}</td>
                                        <td>{product.averageRating?.toFixed(1)} ★</td>
                                        <td>
                                            <Link to={`/products/${product._id}`} className={styles.iconButton}>
                                                <Package size={18} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminProducts;
