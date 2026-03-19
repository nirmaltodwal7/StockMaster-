'use client';
import { Sun, Moon, Bell, User } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 glass rounded-none border-x-0 border-t-0 z-40 flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-xl">
          S
        </div>
        <span className="font-bold text-lg tracking-tight">Stock<span className="text-primary">Master</span></span>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-accent/50 text-muted-foreground transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        
        <button className="p-2 rounded-full hover:bg-accent/50 text-muted-foreground transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive"></span>
        </button>

        <div className="h-8 w-px bg-border mx-1"></div>
        
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-semibold leading-none">{user?.name || 'Guest'}</span>
            <span className="text-xs text-muted-foreground mt-1 capitalize">{user?.role || 'User'}</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-accent border border-border flex items-center justify-center text-muted-foreground">
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>
    </header>
  );
};
