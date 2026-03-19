'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus } from 'lucide-react';
import api from '@/utils/api';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Table, TableRow, TableCell } from '@/components/ui/Table';

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    productId: '',
    quantitySold: 1
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [salesRes, productsRes] = await Promise.all([
        api.get('/sales'),
        api.get('/products')
      ]);
      setSales(salesRes.data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setProducts(productsRes.data);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/sales', formData);
      setIsModalOpen(false);
      setFormData({ productId: '', quantitySold: 1 });
      fetchData();
    } catch (error) {
      console.error('Failed to record sale', error);
      alert(error.response?.data?.message || 'Error recording sale');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pt-16 md:pl-64">
      <Navbar />
      <div className="hidden md:block"><Sidebar /></div>
      
      <main className="flex-1 p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Sales</h1>
            <p className="text-muted-foreground">Record new sales and track recent transactions.</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-5 h-5" /> Record Sale
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card>
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-primary" />
              Recent Transactions
            </h3>

            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <Table headers={['Date', 'Product', 'Quantity', 'Amount', 'Profit']}>
                {sales.length > 0 ? sales.map((sale) => (
                  <TableRow key={sale._id}>
                    <TableCell className="text-muted-foreground">
                      {new Date(sale.date).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{sale.product?.name || 'Deleted Product'}</div>
                      <div className="text-xs text-muted-foreground">{sale.product?.sku}</div>
                    </TableCell>
                    <TableCell>{sale.quantitySold}</TableCell>
                    <TableCell className="font-bold text-foreground">
                      ₹{sale.totalAmount?.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-success font-medium">
                      +₹{sale.profit?.toLocaleString()}
                    </TableCell>
                  </TableRow>
                )) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-muted-foreground">
                      No sales recorded yet.
                    </td>
                  </tr>
                )}
              </Table>
            )}
          </Card>
        </motion.div>
      </main>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Record New Sale"
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="productId" className="text-sm font-medium text-foreground/80">Select Product</label>
            <select
              id="productId"
              value={formData.productId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 glass-input text-foreground outline-none border-border"
            >
              <option value="" disabled className="bg-background text-muted-foreground">Select a product...</option>
              {products.filter(p => p.quantity > 0).map(product => (
                <option key={product._id} value={product._id} className="bg-background text-foreground">
                  {product.name} (Stock: {product.quantity} - ₹{product.sellingPrice})
                </option>
              ))}
            </select>
          </div>
          
          <Input 
            id="quantitySold" 
            type="number" 
            label="Quantity" 
            value={formData.quantitySold} 
            onChange={handleChange} 
            required 
            min="1" 
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Complete Sale</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
