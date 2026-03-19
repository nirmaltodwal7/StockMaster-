'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import api from '@/utils/api';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Table, TableRow, TableCell } from '@/components/ui/Table';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '', sku: '', category: '', costPrice: '', sellingPrice: '', quantity: '', lowStockThreshold: ''
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenModal = (product = null) => {
    if (product) {
      setCurrentProduct(product);
      setFormData(product);
    } else {
      setCurrentProduct(null);
      setFormData({ name: '', sku: '', category: '', costPrice: '', sellingPrice: '', quantity: '', lowStockThreshold: '10' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentProduct(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentProduct) {
        await api.put(`/products/${currentProduct._id}`, formData);
      } else {
        await api.post('/products', formData);
      }
      handleCloseModal();
      fetchProducts();
    } catch (error) {
      console.error('Failed to save product', error);
      alert(error.response?.data?.message || 'Error saving product');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Failed to delete product', error);
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.sku.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex flex-col pt-16 md:pl-64">
      <Navbar />
      <div className="hidden md:block"><Sidebar /></div>
      
      <main className="flex-1 p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Products</h1>
            <p className="text-muted-foreground">Manage your inventory, tracking, and pricing.</p>
          </div>
          <Button onClick={() => handleOpenModal()}>
            <Plus className="w-5 h-5" /> Add Product
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="mb-6">
            <div className="flex items-center gap-2 mb-6 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search products by name, SKU or category..." 
                  className="w-full pl-10 pr-4 py-2 glass-input text-foreground"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <Table headers={['Product Name', 'SKU', 'Category', 'Price', 'Stock', 'Actions']}>
                {filteredProducts.length > 0 ? filteredProducts.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <div className="font-medium">{product.name}</div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                    <TableCell>
                      <span className="px-2.5 py-1 bg-accent rounded-full text-xs font-medium">
                        {product.category}
                      </span>
                    </TableCell>
                    <TableCell>
                      ₹{product.sellingPrice} <span className="text-xs text-muted-foreground">/ cost: ₹{product.costPrice}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className={`font-medium ${product.quantity <= product.lowStockThreshold ? 'text-destructive' : 'text-success'}`}>
                          {product.quantity} in stock
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleOpenModal(product)}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product._id)}
                          className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                )) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-muted-foreground">
                      No products found matching your search.
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
        onClose={handleCloseModal} 
        title={currentProduct ? 'Edit Product' : 'Add New Product'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <Input id="name" label="Product Name" value={formData.name} onChange={handleChange} required />
            <Input id="sku" label="SKU" value={formData.sku} onChange={handleChange} required />
          </div>
          
          <Input id="category" label="Category" value={formData.category} onChange={handleChange} required />
          
          <div className="grid grid-cols-2 gap-4">
            <Input id="costPrice" type="number" label="Cost Price (₹)" value={formData.costPrice} onChange={handleChange} required min="0" step="0.01" />
            <Input id="sellingPrice" type="number" label="Selling Price (₹)" value={formData.sellingPrice} onChange={handleChange} required min="0" step="0.01" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input id="quantity" type="number" label="Quantity" value={formData.quantity} onChange={handleChange} required min="0" />
            <Input id="lowStockThreshold" type="number" label="Low Stock Alert At" value={formData.lowStockThreshold} onChange={handleChange} required min="0" />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" type="button" onClick={handleCloseModal}>Cancel</Button>
            <Button type="submit">{currentProduct ? 'Save Changes' : 'Add Product'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
