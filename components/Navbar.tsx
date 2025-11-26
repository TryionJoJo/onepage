import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Hexagon, ShieldCheck } from 'lucide-react';
import { storageService } from '../services/storage';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const user = storageService.getCurrentUser();

  const navLinks = [
    { name: '首页', path: '/' },
    { name: '关于我们', path: '/about' },
    { name: '项目展示', path: '/projects' },
    { name: '新闻中心', path: '/news' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
              <Hexagon className="w-8 h-8 text-blue-500 fill-current" />
              <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tight text-white leading-none">APEX</span>
                <span className="text-[10px] text-blue-400 font-semibold tracking-widest uppercase leading-none">Engineering</span>
              </div>
            </Link>
            
            <div className="hidden md:ml-12 md:flex md:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`${
                    isActive(link.path)
                      ? 'border-blue-500 text-white'
                      : 'border-transparent text-slate-300 hover:text-white hover:border-slate-300'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors h-20`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
             {user ? (
               <Link 
                 to="/admin" 
                 className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-600 transition-colors shadow-sm"
               >
                 <ShieldCheck className="w-4 h-4 mr-2" />
                 管理后台
               </Link>
             ) : (
                <Link 
                  to="/login"
                  className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
                >
                  员工登录
                </Link>
             )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`${
                  isActive(link.path)
                    ? 'bg-slate-900 border-blue-500 text-white'
                    : 'border-transparent text-slate-300 hover:bg-slate-700 hover:text-white'
                } block pl-3 pr-4 py-3 border-l-4 text-base font-medium`}
              >
                {link.name}
              </Link>
            ))}
             {user ? (
               <Link 
                 to="/admin" 
                 onClick={() => setIsOpen(false)}
                 className="block pl-3 pr-4 py-3 border-l-4 border-transparent text-base font-medium text-blue-400 hover:bg-slate-700 hover:text-white"
               >
                 管理后台
               </Link>
             ) : (
                <Link 
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block pl-3 pr-4 py-3 border-l-4 border-transparent text-base font-medium text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  员工登录
                </Link>
             )}
          </div>
        </div>
      )}
    </nav>
  );
};