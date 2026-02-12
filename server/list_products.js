const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./src/models/Product');

dotenv.config({ path: './.env' });

const checkProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        const products = await Product.find({});
        const fs = require('fs');
        let output = `Total Products Found: ${products.length}\n`;
        products.forEach((p, index) => {
            output += `${index + 1}. Name: "${p.name}", Brand: "${p.brand}", Reviews: ${p.reviewCount || 0}, ID: ${p._id}\n`;
        });
        fs.writeFileSync('products_list.txt', output);
        console.log('Product list saved to products_list.txt');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkProducts();
