const Sale = require('../models/Sale');
const Product = require('../models/Product');

const getSales = async (req, res) => {
  try {
    const sales = await Sale.find({}).populate('product', 'name sku category');
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const recordSale = async (req, res) => {
  try {
    const { productId, quantitySold } = req.body;
    
    // Find product
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    if (product.quantity < quantitySold) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }
    
    // Calculate totals
    const totalAmount = quantitySold * product.sellingPrice;
    const profit = (product.sellingPrice - product.costPrice) * quantitySold;
    
    // Create Sale
    const sale = await Sale.create({
      product: productId,
      quantitySold,
      totalAmount,
      profit
    });
    
    // Auto-update Product Stock
    product.quantity -= quantitySold;
    await product.save();
    
    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSales, recordSale };
