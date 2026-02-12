const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Get reviews
// @route   GET /api/reviews
// @route   GET /api/products/:productId/reviews
// @access  Public
// @desc    Get reviews
// @route   GET /api/reviews
// @route   GET /api/products/:productId/reviews
// @access  Public
exports.getReviews = async (req, res) => {
    try {
        let query;

        // If productId is provided in params, simple fetch for that product
        if (req.params.productId) {
            query = Review.find({ product: req.params.productId }).populate({
                path: 'user',
                select: 'name email'
            });
        } else {
            // General fetch (e.g. for Admin or Global Search) with filtering
            const reqQuery = { ...req.query };

            // Fields to exclude from filtering
            // Fields to exclude from filtering
            const removeFields = ['select', 'sort', 'page', 'limit', 'search', 'category', 'brand', 'productType'];
            removeFields.forEach(param => delete reqQuery[param]);

            // Create query string for advanced filtering (gt, gte, etc.)
            let queryStr = JSON.stringify(reqQuery);
            queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

            let parsedQuery = JSON.parse(queryStr);

            // Search functionality (Product Name, Brand, Review Comment)
            // This is complex because Review doesn't have product name/brand directly.
            // We usually need aggregation or populate filtering.
            // For simplicity in this stack, we'll fetch reviews and populate product, then filter in memory 
            // OR use aggregate if performance is key. Given the task size, let's try a mix or simple Filter.

            // Actually, if we want to filter by "Category" or "Brand", those are on the Product model.
            // We can search for products first, get their IDs, and then find reviews for those IDs.

            if (req.query.search || req.query.category || req.query.brand || req.query.productType) {
                const productQuery = {};

                // Only apply product-specific text search if we are looking for product attributes
                if (req.query.search) {
                    productQuery.$or = [
                        { name: { $regex: req.query.search, $options: 'i' } },
                        { brand: { $regex: req.query.search, $options: 'i' } },
                        { productType: { $regex: req.query.search, $options: 'i' } }
                    ];
                }

                // Case-insensitive category match
                if (req.query.category && req.query.category !== 'All') {
                    productQuery.category = { $regex: new RegExp(`^${req.query.category}$`, 'i') };
                }

                if (req.query.brand) productQuery.brand = { $regex: new RegExp(`^${req.query.brand}$`, 'i') };
                if (req.query.productType) productQuery.productType = { $regex: new RegExp(`^${req.query.productType}$`, 'i') };

                // Find matching products
                const products = await Product.find(productQuery).select('_id');
                const productIds = products.map(p => p._id);

                if (req.query.search) {
                    // If searching, we want reviews for matching products OR reviews with matching comments
                    // We must combine this with other filters (like category) if they exist.
                    // However, if category is selected, we only want reviews for products in that category.

                    // Logic: 
                    // 1. If Category selected: Products must match category AND (Product match search OR Review match search)
                    //    But product filtering is already done above in productQuery. 
                    //    So productIds contains only products in that category (if filtered).

                    // So we want:
                    // (Review.product IN productIds) OR (Review.comment matches search AND Review.product IN all_products_of_category)

                    // Simplified approach for this app:
                    // If search is present:
                    // Match reviews where (product is in match_products) OR (comment matches search)

                    // BUT if category is present, 'productIds' only includes products of that category.
                    // So we should enforce product constraints if category/brand filters exist.

                    const searchCondition = {
                        $or: [
                            { product: { $in: productIds } },
                            { comment: { $regex: req.query.search, $options: 'i' } }
                        ]
                    };

                    // If we have strict product filters (like Category), we must ensure the "comment match" 
                    // also respects the category.
                    if (req.query.category && req.query.category !== 'All') {
                        // Logic: (Product match search OR Comment match search) AND (Product in Category)
                        // 'productIds' already has products in category AND matching search.
                        // We need all products in category to intersect with comment search.

                        // Let's refetch ALL products in this category to constrain the comment search
                        const allCategoryProducts = await Product.find({
                            category: { $regex: new RegExp(`^${req.query.category}$`, 'i') }
                        }).select('_id');
                        const categoryProductIds = allCategoryProducts.map(p => p._id);

                        parsedQuery.$and = [
                            { product: { $in: categoryProductIds } },
                            searchCondition
                        ];
                    } else {
                        Object.assign(parsedQuery, searchCondition);
                    }

                } else {
                    // No search term, just standard filtering (Category, Brand, etc)
                    if (products.length === 0 && (req.query.category || req.query.brand)) {
                        return res.status(200).json({ success: true, count: 0, data: [] });
                    }
                    if (req.query.category || req.query.brand) {
                        parsedQuery.product = { $in: productIds };
                    }
                }
            }

            // Review text search
            if (req.query.search) {
                // If we already have product IDs, we want (Product Match OR Review Text Match)
                // But MongoDB doesn't easily do $or across relationships in simple find().
                // Let's keep it simple: strict filtering. If user searches, we look in product names.
                // Optionally add review text search:
                // parsedQuery.comment = { $regex: req.query.search, $options: 'i' }; 
                // But that would conflict with product search logic above if we want specific behavior.
                // Let's rely on the product filter above for "Search".
            }

            query = Review.find(parsedQuery).populate({
                path: 'product',
                select: 'name brand category productType image'
            }).populate({
                path: 'user',
                select: 'name email'
            });

            // Sorting
            if (req.query.sort) {
                const sortBy = req.query.sort.split(',').join(' ');
                query = query.sort(sortBy);
            } else {
                query = query.sort('-createdAt');
            }
        }

        const reviews = await query;

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        // Make sure user is review owner or admin
        if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized to update review' });
        }

        await review.deleteOne();
        await Review.getAverageRating(review.product);

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Add review
// @route   POST /api/products/:productId/reviews
// @access  Private
exports.addReview = async (req, res) => {
    try {
        req.body.product = req.params.productId;
        req.body.user = req.user.id;

        const product = await Product.findById(req.params.productId);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const review = await Review.create(req.body);

        res.status(201).json({
            success: true,
            data: review
        });
    } catch (err) {
        // Handle duplicate key error (user has already reviewed this product)
        if (err.code === 11000) {
            return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
        }
        res.status(400).json({ success: false, message: err.message });
    }
};
// @desc    Add review for a product (or create product if not exists)
// @route   POST /api/reviews/standalone
// @access  Private
exports.addReviewStandalone = async (req, res) => {
    try {
        const { productName, brand, category, productType, rating, comment } = req.body;
        const userId = req.user.id;

        // 1. Find or Create Product
        let product = await Product.findOne({
            name: { $regex: new RegExp(`^${productName}$`, 'i') },
            brand: { $regex: new RegExp(`^${brand}$`, 'i') }
        });

        if (!product) {
            // Create new product
            product = await Product.create({
                name: productName,
                brand,
                category,
                productType: productType || 'General',
                user: userId,
                price: 0,
                description: `Product added by ${req.user.name}`,
                image: 'https://via.placeholder.com/150',
                averageRating: Number(rating),
                reviewCount: 1
            });
        } else {
            // Update existing product stats
            const currentRating = product.averageRating || 0;
            const currentCount = product.reviewCount || 0;

            const newReviewCount = currentCount + 1;
            const newAvgRating = ((currentRating * currentCount) + Number(rating)) / newReviewCount;

            product.reviewCount = newReviewCount;
            product.averageRating = newAvgRating;
            await product.save();
        }

        // 2. Add Review
        const existingReview = await Review.findOne({ product: product._id, user: userId });
        if (existingReview) {
            return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
        }

        const review = await Review.create({
            user: userId,
            product: product._id,
            rating,
            comment
        });

        res.status(201).json({
            success: true,
            data: review,
            product: product
        });

    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, message: err.message });
    }
};
