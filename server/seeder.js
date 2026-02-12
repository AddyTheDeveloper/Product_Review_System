const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const User = require('./src/models/User');
const connectDB = require('./src/config/db');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

const importData = async () => {
    try {
        // Check if admin already exists
        const adminEmail = 'adityahans.17@gmail.com';
        await User.findOneAndDelete({ email: adminEmail });

        const user = await User.create({
            name: 'Aditya Hans',
            email: adminEmail,
            password: 'admin1234',
            role: 'admin'
        });

        console.log(`Admin User Created: ${user.name} (${user.email})`.green.inverse);
        process.exit();
    } catch (err) {
        console.error(`${err}`.red.inverse);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    // destroyData();
} else {
    importData();
}
