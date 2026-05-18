import React, { useContext } from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Users, UserPlus, Brain, LayoutDashboard, LogOut } from 'lucide-react';

const SidebarItem = ({ icon: Icon, text, to, active }) => (
  <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${active ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}>
    <Icon size={20} />
    <span className="font-medium">{text}</span>
  </Link>
);

const DashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-darkNavy text-slate-200">
      {/* Sidebar */}
      <aside className="w-64 glass-card m-4 flex flex-col hidden md:flex border-r-0">
        <div className="p-6">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">HR Analytics</h1>
          <p className="text-sm text-slate-400 mt-1">Welcome, {user.name}</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <SidebarItem icon={LayoutDashboard} text="Dashboard" to="/" active={location.pathname === '/'} />
          <SidebarItem icon={Users} text="Employee List" to="/employees" active={location.pathname === '/employees'} />
          <SidebarItem icon={UserPlus} text="Add Employee" to="/add-employee" active={location.pathname === '/add-employee'} />
          <SidebarItem icon={Brain} text="AI Recommendations" to="/ai-recommendations" active={location.pathname === '/ai-recommendations'} />
        </nav>

        <div className="p-4">
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden p-4 pl-0">
        <div className="flex-1 overflow-y-auto glass-card p-6 border-l-0 md:rounded-l-none">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
