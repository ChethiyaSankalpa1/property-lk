import React, { useState } from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  LayoutDashboard, 
  PlusCircle, 
  Settings, 
  LogOut, 
  Globe, 
  Menu, 
  X, 
  ShieldAlert,
  ListFilter
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useProperties } from '../../context/PropertyContext';

export default function AdminLayout() {
  const { isAuthenticated, logout } = useAdminAuth();
  const { properties } = useProperties();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If not authenticated, navigate to login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4">
        <div className="text-center text-white space-y-4 max-w-sm">
          <p className="text-sm text-slate-300">You must be logged in to access the admin portal.</p>
          <Link
            to="/admin/login"
            className="inline-block px-6 py-3 rounded-xl bg-emerald-500 text-navy-950 font-bold text-xs uppercase tracking-wider"
          >
            Go to Admin Sign In
          </Link>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Add New Listing', path: '/admin/add', icon: PlusCircle },
    { name: 'Settings & Cloudinary', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col bg-navy-950 text-slate-300 border-r border-navy-800 shrink-0 min-h-screen">
        
        {/* Logo */}
        <div className="p-6 border-b border-navy-800/80">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-navy-950 shadow-glow-emerald">
              <Building2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="font-serif text-lg font-bold text-white tracking-wider">
                  PROPERTY
                </span>
                <span className="font-serif text-lg font-extrabold text-emerald-400">
                  LK
                </span>
              </div>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold block -mt-0.5">
                Admin Console
              </span>
            </div>
          </Link>
        </div>

        {/* Prototype Warning Pill */}
        <div className="px-4 py-3 mx-4 mt-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] leading-tight flex items-start space-x-2">
          <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-amber-400 mt-0.5" />
          <span>Frontend Prototype. Data stored in browser LocalStorage.</span>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1.5 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-navy-950 shadow-glow-emerald'
                    : 'text-slate-300 hover:bg-navy-900 hover:text-white'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-navy-800/80 space-y-2">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-emerald-400 hover:bg-navy-900 transition-colors"
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>View Live Website</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="md:hidden bg-navy-950 text-white p-4 border-b border-navy-800 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-navy-950 font-bold">
            <Building2 className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="font-serif font-bold text-base tracking-wider">
            PROPERTY LK <span className="text-emerald-400 text-xs">ADMIN</span>
          </span>
        </div>

        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-lg bg-navy-900 text-slate-200"
          aria-label="Toggle navigation menu"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="md:hidden bg-navy-950 text-white p-4 border-b border-navy-800 space-y-2 z-40">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              onClick={() => setMobileSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider ${
                  isActive ? 'bg-emerald-500 text-navy-950' : 'text-slate-300 hover:bg-navy-900'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
            </NavLink>
          ))}

          <div className="pt-2 border-t border-navy-800 flex justify-between items-center text-xs">
            <Link to="/" className="text-emerald-400 font-semibold">View Live Website</Link>
            <button onClick={handleLogout} className="text-red-400 font-semibold">Sign Out</button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

    </div>
  );
}
