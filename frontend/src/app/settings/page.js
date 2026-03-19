'use client';
import { motion } from 'framer-motion';
import { User, Shield, Moon, Sun } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background flex flex-col pt-16 md:pl-64">
      <Navbar />
      <div className="hidden md:block"><Sidebar /></div>
      
      <main className="flex-1 p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and application settings.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl space-y-6"
        >
          <Card>
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Profile Information
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-1">Full Name</label>
                  <div className="p-3 bg-accent/40 rounded-lg border border-border font-medium">
                    {user?.name || 'Loading...'}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-1">Email Address</label>
                  <div className="p-3 bg-accent/40 rounded-lg border border-border font-medium">
                    {user?.email || 'Loading...'}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1">Role</label>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full border border-primary/20 text-sm font-semibold capitalize">
                  <Shield className="w-4 h-4" />
                  {user?.role || 'User'}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              {theme === 'dark' ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
              Appearance
            </h3>
            
            <div className="flex items-center justify-between p-4 bg-accent/30 border border-border rounded-xl">
              <div>
                <h4 className="font-medium">Theme Mode</h4>
                <p className="text-sm text-muted-foreground">Switch between Light and Dark aesthetics.</p>
              </div>
              <Button onClick={toggleTheme} variant="outline" className="min-w-[120px]">
                {theme === 'dark' ? 'Use Light Mode' : 'Use Dark Mode'}
              </Button>
            </div>
          </Card>

          <Card className="border-destructive/30">
            <h3 className="text-lg font-semibold text-destructive mb-4">Danger Zone</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Options here can affect your account access and data. Proceed with caution.
            </p>
            <Button variant="danger" onClick={logout}>
              Sign Out of Account
            </Button>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
