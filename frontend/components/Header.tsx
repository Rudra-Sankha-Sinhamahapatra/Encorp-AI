'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Github,
  Star,
  LogOut,
  Menu,
  X,
  Home,
  Plus,
  User,
 MonitorPlay,
  Sparkles,
} from 'lucide-react';

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = Cookies.get('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('userId');
    toast.success('Logged out successfully');
    setIsLoggedIn(false);
    router.push('/');
  };

  useEffect(() => {
    if (isLoggedIn && (pathname?.includes('/auth/login') || pathname?.includes('/auth/signup'))) {
      router.push('/dashboard');
    }
  }, [isLoggedIn, pathname, router]);

  return (
    <div className="w-full sticky top-0 z-50 py-4 px-4">
      <motion.header 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto rounded-full backdrop-blur-xl bg-black/40 border border-white/10 shadow-lg shadow-black/20"
      >
        <div className="px-5 py-3 flex justify-between items-center">
        
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-primary/20 to-blue-600/20 p-2 rounded-lg group-hover:from-primary/30 group-hover:to-blue-600/30 transition-all duration-300"
            >
              <MonitorPlay className="h-5 w-5 text-primary group-hover:text-blue-400 transition-colors" />
            </motion.div>
            <span className="font-bold text-lg gradient-text">Encorp AI</span>
          </Link>

      
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <motion.div 
                className="flex items-center gap-3 mr-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Link 
                  href="/dashboard" 
                  className={`text-sm px-3 py-1.5 rounded-full transition-all ${pathname === '/dashboard' 
                    ? 'bg-primary/20 text-primary' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-primary'}`}
                >
                  <div className="flex items-center gap-1.5">
                    <Home className="h-3.5 w-3.5" />
                    <span>Dashboard</span>
                  </div>
                </Link>
                <Link 
                  href="/create" 
                  className={`text-sm px-3 py-1.5 rounded-full transition-all ${pathname === '/create' 
                    ? 'bg-primary/20 text-primary' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-primary'}`}
                >
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Create</span>
                  </div>
                </Link>
              </motion.div>
            ) : null}
            
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              href="https://github.com/Rudra-Sankha-Sinhamahapatra/Encorp" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1.5 bg-gradient-to-r from-zinc-800/90 to-zinc-900/90 
              hover:from-zinc-700/90 hover:to-zinc-800/90 text-white rounded-full py-1 px-3 transition-all
              border border-white/10 hover:border-white/20 shadow-md shadow-black/20"
            >
              <Star className="h-3 w-3 text-yellow-300" fill="#fde047" />
              <span className="font-medium text-xs">Star on GitHub</span>
            </motion.a>
            
            {isLoggedIn ? (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 hover:bg-red-950/30 px-3 py-1 h-auto rounded-full ml-1"
              >
                <LogOut className="h-3.5 w-3.5 mr-1.5" />
                <span className="text-xs">Logout</span>
              </Button>
            ) : (
              <motion.div 
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => router.push('/auth/login')}
                  className="text-gray-200 hover:text-white hover:bg-white/5 px-3 py-1 h-auto rounded-full"
                >
                  <span className="text-xs">Login</span>
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => router.push('/auth/signup')}
                  className="bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 px-3 py-1 h-auto rounded-full"
                >
                  <span className="text-xs">Sign Up</span>
                </Button>
              </motion.div>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-gray-400 hover:text-primary bg-white/5 hover:bg-white/10 p-1.5 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? 
              <X className="h-4 w-4" /> : 
              <Menu className="h-4 w-4" />
            }
          </button>
        </div>
      </motion.header>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="md:hidden max-w-xs mx-auto mt-2 glass-card rounded-xl overflow-hidden"
        >
          <div className="px-4 py-3 flex flex-col gap-2">
            {isLoggedIn ? (
              <>
                <Link 
                  href="/dashboard" 
                  className={`flex items-center gap-2 p-2 rounded-lg transition-all ${pathname === '/dashboard' 
                    ? 'bg-primary/20 text-primary' 
                    : 'hover:bg-white/5 text-gray-300'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Home className="h-4 w-4" />
                  <span className="font-medium text-sm">Dashboard</span>
                </Link>
                <Link 
                  href="/create" 
                  className={`flex items-center gap-2 p-2 rounded-lg transition-all ${pathname === '/create' 
                    ? 'bg-primary/20 text-primary' 
                    : 'hover:bg-white/5 text-gray-300'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Sparkles className="h-4 w-4" />
                  <span className="font-medium text-sm">Create Presentation</span>
                </Link>
              </>
            ) : (
              <div className="space-y-2 mb-2">
                <Link 
                  href="/auth/login" 
                  className="flex items-center gap-2 p-2 hover:bg-white/5 text-gray-300 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">Login</span>
                </Link>
                <Link 
                  href="/auth/signup" 
                  className="flex items-center gap-2 p-2 bg-gradient-to-r from-primary/20 to-blue-500/20 
                    hover:from-primary/30 hover:to-blue-500/30 text-primary rounded-lg transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Plus className="h-4 w-4" />
                  <span className="font-medium text-sm">Sign Up</span>
                </Link>
              </div>
            )}
            
            <div className="border-t border-white/10 my-2 pt-2">
              {/* GitHub Star Button for mobile */}
              <a 
                href="https://github.com/yourusername/Slides-AI" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-2 bg-gradient-to-r from-zinc-800 to-zinc-900 
                  hover:from-zinc-700 hover:to-zinc-800 rounded-lg my-1 transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Star className="h-4 w-4 text-yellow-300" fill="#fde047" />
                <span className="font-medium text-sm">Star on GitHub</span>
              </a>
              
              {isLoggedIn && (
                <button 
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 p-2 w-full text-left mt-2 
                    text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="font-medium text-sm">Logout</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}