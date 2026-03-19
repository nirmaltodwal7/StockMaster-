const Product = require('../models/Product');

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, sku, category, costPrice, sellingPrice, quantity, lowStockThreshold } = req.body;
    const productExists = await Product.findOne({ sku });
    if (productExists) return res.status(400).json({ message: 'Product with this SKU already exists' });

    const product = await Product.create({ name, sku, category, costPrice, sellingPrice, quantity, lowStockThreshold });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, sku, category, costPrice, sellingPrice, quantity, lowStockThreshold } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.sku = sku || product.sku;
      product.category = category || product.category;
      product.costPrice = costPrice !== undefined ? costPrice : product.costPrice;
      product.sellingPrice = sellingPrice !== undefined ? sellingPrice : product.sellingPrice;
      product.quantity = quantity !== undefined ? quantity : product.quantity;
      product.lowStockThreshold = lowStockThreshold !== undefined ? lowStockThreshold : product.lowStockThreshold;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };
