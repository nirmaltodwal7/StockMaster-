require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Product = require('../models/Product');
const Sale = require('../models/Sale');

// Fallback to local if no env
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/stockmanagement';

const importData = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to DB for Seeding...');

    await User.deleteMany();
    await Product.deleteMany();
    await Sale.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const createdUsers = await User.insertMany([
      { name: 'Admin User', email: 'admin@example.com', password: hashedPassword, role: 'admin' },
      { name: 'Staff User', email: 'staff@example.com', password: hashedPassword, role: 'staff' }
    ]);

    const createdProducts = await Product.insertMany([
      { name: 'Laptop Pro', sku: 'LAP-001', category: 'Electronics', costPrice: 800, sellingPrice: 1200, quantity: 50, lowStockThreshold: 10 },
      { name: 'Wireless Mouse', sku: 'MOU-002', category: 'Accessories', costPrice: 15, sellingPrice: 40, quantity: 200, lowStockThreshold: 20 },
      { name: 'Mechanical Keyboard', sku: 'KEY-003', category: 'Accessories', costPrice: 40, sellingPrice: 100, quantity: 80, lowStockThreshold: 15 },
      { name: 'USB-C Hub', sku: 'HUB-004', category: 'Accessories', costPrice: 20, sellingPrice: 60, quantity: 5, lowStockThreshold: 10 },
      { name: 'Gaming Monitor', sku: 'MON-005', category: 'Electronics', costPrice: 200, sellingPrice: 350, quantity: 30, lowStockThreshold: 5 }
    ]);

    const sales = [];
    for(let i=0; i<30; i++) {
        const product = createdProducts[Math.floor(Math.random() * createdProducts.length)];
        const qty = Math.floor(Math.random() * 5) + 1;
        const total = qty * product.sellingPrice;
        const profit = (product.sellingPrice - product.costPrice) * qty;
        
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 60)); // Random date within last 60 days
        
        sales.push({ product: product._id, quantitySold: qty, totalAmount: total, profit, date });
    }
    
    await Sale.insertMany(sales);

    console.log('Data Imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with seeding data: ${error}`);
    process.exit(1);
  }
};

importData();
