const Product = require('../models/Product');
const Sale = require('../models/Sale');

const getDashboardStats = async (req, res) => {
  try {
    const products = await Product.find({});
    const sales = await Sale.find({});
    
    const totalProducts = products.length;
    const totalRevenue = sales.reduce((acc, sale) => acc + sale.totalAmount, 0);
    const totalProfit = sales.reduce((acc, sale) => acc + sale.profit, 0);
    const lowStockAlerts = products.filter(p => p.quantity <= p.lowStockThreshold);
    
    // Group sales by month
    const monthlySales = sales.reduce((acc, sale) => {
      const month = new Date(sale.date).toLocaleString('default', { month: 'short' });
      if (!acc[month]) {
        acc[month] = { name: month, revenue: 0, profit: 0, salesCount: 0 };
      }
      acc[month].revenue += sale.totalAmount;
      acc[month].profit += sale.profit;
      acc[month].salesCount += 1;
      return acc;
    }, {});
    
    res.json({
      totalProducts,
      totalRevenue,
      totalProfit,
      lowStockAlerts,
      monthlySalesData: Object.values(monthlySales)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
