import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { storageService } from '../../services/storage';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Hexagon
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const user = storageService.getCurrentUser();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    storageService.logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex md:w-64 flex-col bg-slate-900 text-white border-r border-slate-800">
        <div className="flex items-center justify-center h-20 border-b border-slate-800">
           <Link to="/" className="flex items-center space-x-2">
              <Hexagon className="w-6 h-6 text-blue-500" />
              <span className="font-bold text-lg">Apex 管理后台</span>
           </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
           <Link to="/admin" className="flex items-center px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors group">
              <LayoutDashboard className="w-5 h-5 mr-3 group-hover:text-blue-500" />
              仪表盘
           </Link>
           <Link to="/admin/articles" className="flex items-center px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors group">
              <FileText className="w-5 h-5 mr-3 group-hover:text-blue-500" />
              文章管理
           </Link>
           <Link to="/admin/settings" className="flex items-center px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors group">
              <Settings className="w-5 h-5 mr-3 group-hover:text-blue-500" />
              设置
           </Link>
        </div>

        <div className="p-4 border-t border-slate-800">
           <div className="flex items-center mb-4">
             <img src={user.avatar} alt="User" className="w-10 h-10 rounded-full mr-3 border-2 border-slate-700" />
             <div>
               <p className="text-sm font-medium text-white">{user.username}</p>
               <p className="text-xs text-slate-500">{user.role}</p>
             </div>
           </div>
           <button onClick={handleLogout} className="w-full flex items-center justify-center px-4 py-2 border border-slate-700 rounded-md text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
             <LogOut className="w-4 h-4 mr-2" /> 退出登录
           </button>
        </div>
      </aside>

      {/* Mobile Header & Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
         {/* Mobile Header */}
         <header className="md:hidden bg-slate-900 text-white h-16 flex items-center justify-between px-4">
             <div className="flex items-center">
               <Hexagon className="w-6 h-6 text-blue-500 mr-2" />
               <span className="font-bold">后台管理</span>
             </div>
             <button onClick={() => setSidebarOpen(!sidebarOpen)}>
               {sidebarOpen ? <X /> : <Menu />}
             </button>
         </header>
         
         {/* Mobile Menu Overlay */}
         {sidebarOpen && (
           <div className="md:hidden fixed inset-0 z-50 bg-slate-900 flex flex-col p-4">
              <div className="flex justify-end mb-8">
                <button onClick={() => setSidebarOpen(false)}><X className="text-white w-8 h-8" /></button>
              </div>
              <nav className="space-y-4">
                 <Link to="/admin" onClick={() => setSidebarOpen(false)} className="flex items-center text-xl text-slate-300 py-2">仪表盘</Link>
                 <Link to="/admin/articles" onClick={() => setSidebarOpen(false)} className="flex items-center text-xl text-slate-300 py-2">文章管理</Link>
                 <button onClick={handleLogout} className="flex items-center text-xl text-red-400 py-2 mt-8">退出登录</button>
              </nav>
           </div>
         )}

         <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 p-6">
           <Outlet />
         </main>
      </div>
    </div>
  );
};