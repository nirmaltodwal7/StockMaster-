'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Package, TrendingUp, AlertTriangle } from 'lucide-react';
import api from '@/utils/api';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/analytics');
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex flex-col pt-16 md:pl-64">
      <Navbar />
      <div className="hidden md:block"><Sidebar /></div>
      <main className="flex-1 p-8 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </main>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col pt-16 md:pl-64">
      <Navbar />
      <div className="hidden md:block"><Sidebar /></div>
      
      <main className="flex-1 p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name || 'User'}. Here's what's happening with your store today.</p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVariants}>
            <Card className="flex items-center gap-4">
              <div className="p-4 bg-primary/10 text-primary rounded-xl">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Revenue</p>
                <h3 className="text-2xl font-bold">₹{stats?.totalRevenue?.toLocaleString() || 0}</h3>
              </div>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="flex items-center gap-4">
              <div className="p-4 bg-success/10 text-success rounded-xl">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Profit</p>
                <h3 className="text-2xl font-bold">₹{stats?.totalProfit?.toLocaleString() || 0}</h3>
              </div>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="flex items-center gap-4">
              <div className="p-4 bg-blue-500/10 text-blue-500 rounded-xl">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Products</p>
                <h3 className="text-2xl font-bold">{stats?.totalProducts || 0}</h3>
              </div>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="flex items-center gap-4">
              <div className="p-4 bg-destructive/10 text-destructive rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Low Stock Alerts</p>
                <h3 className="text-2xl font-bold">{stats?.lowStockAlerts?.length || 0}</h3>
              </div>
            </Card>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-6">Monthly Revenue Overview</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.monthlySalesData || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'var(--muted-foreground)' }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'var(--muted-foreground)' }}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Tooltip 
                    cursor={{ fill: 'var(--accent)', opacity: 0.4 }}
                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--foreground)' }}
                  />
                  <Bar dataKey="revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="profit" fill="var(--success)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          <Card className="flex flex-col">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Low Stock Items
            </h3>
            <div className="flex-1 overflow-auto max-h-[300px] pr-2">
              {stats?.lowStockAlerts?.length > 0 ? (
                <div className="space-y-4">
                  {stats.lowStockAlerts.map(product => (
                    <div key={product._id} className="flex items-center justify-between p-3 rounded-lg bg-accent/30 border border-border/50">
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-destructive">{product.quantity}</p>
                        <p className="text-xs text-muted-foreground">in stock</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                  <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center text-success mb-3">
                    <Package className="w-6 h-6" />
                  </div>
                  <p>All stock levels are optimal</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
